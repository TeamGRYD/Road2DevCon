import { ethers } from 'ethers';

const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS;
const RPC_URL = process.env.RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
const FORWARDER_ADDRESS = process.env.VITE_FORWARDER_ADDRESS || '';

// Refuse to relay when gas is unusually expensive or the station is nearly empty
const MAX_FEE_GWEI = process.env.GAS_STATION_MAX_FEE_GWEI || '50';
const MIN_BALANCE_ETH = process.env.GAS_STATION_MIN_BALANCE_ETH || '0.005';
// Signed requests must expire within this window
const MAX_DEADLINE_SECONDS = 24 * 60 * 60;
const SEND_RETRIES = 3;

const FORWARDER_ABI = [
  'function verify((address from, address to, uint256 nonce, uint256 deadline, bytes data) _req, bytes _signature) view returns (bool)',
  'function execute((address from, address to, uint256 nonce, uint256 deadline, bytes data) _req, bytes _signature) returns (bytes)'
];
const TRUST_ABI = ['function isTrustedForwarder(address) view returns (bool)'];

// The gas station only pays for these calls, on these contracts
const RELAYABLE = [
  {
    address: process.env.VITE_PROFILE_REGISTRY_ADDRESS,
    abi: ['function register(string _name, string _xUsername)']
  },
  {
    address: process.env.VITE_CONTRACT_ADDRESS,
    abi: ['function submitScore(uint8 _quizId, uint256 _score, uint256 _nonce, bytes _signature)']
  },
  {
    address: process.env.VITE_FEED_CONTRACT_ADDRESS,
    abi: [
      'function submit(uint8 _topicId, uint8 _platform, string _mediaId)',
      'function vote(uint256 _id, int8 _value)'
    ]
  }
].filter(t => t.address && ethers.isAddress(t.address));

/**
 * POST /api/relay
 *
 * Body: { request: { from, to, nonce, deadline, data }, signature: string }
 * Returns: { txHash: string }
 *
 * Gas station. Checks a participant's EIP-712 signed ForwardRequest and
 * submits it to the GaslessForwarder from the admin wallet, which pays the
 * gas. Returns as soon as the transaction is broadcast; the client waits for
 * the receipt. Responses with `fallback: true` mean the gas station can't
 * help right now and the client may send the transaction directly instead.
 */
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!ADMIN_PRIVATE_KEY || !FORWARDER_ADDRESS) {
    console.error('Gas station not configured (ADMIN_PRIVATE_KEY / VITE_FORWARDER_ADDRESS)');
    return res.status(503).json({ error: 'Gas station not configured', fallback: true });
  }

  try {
    const { request, signature } = req.body || {};

    // Validate request shape
    let forwardRequest;
    try {
      forwardRequest = {
        from: ethers.getAddress(request.from),
        to: ethers.getAddress(request.to),
        nonce: BigInt(request.nonce),
        deadline: BigInt(request.deadline),
        data: ethers.hexlify(request.data)
      };
      ethers.Signature.from(signature);
    } catch {
      return res.status(400).json({ error: 'Malformed relay request' });
    }

    const now = BigInt(Math.floor(Date.now() / 1000));
    if (forwardRequest.deadline < now || forwardRequest.deadline > now + BigInt(MAX_DEADLINE_SECONDS)) {
      return res.status(400).json({ error: 'Request expired. Please try again.' });
    }

    // Only sponsor allowlisted contract functions
    const target = RELAYABLE.find(t => t.address.toLowerCase() === forwardRequest.to.toLowerCase());
    let call = null;
    try {
      call = target && new ethers.Interface(target.abi).parseTransaction({ data: forwardRequest.data });
    } catch {
      call = null;
    }
    if (!call) {
      return res.status(403).json({ error: 'This action is not sponsored by the gas station' });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const relayer = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    if (ADMIN_ADDRESS && relayer.address.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      console.warn(`ADMIN_ADDRESS (${ADMIN_ADDRESS}) does not match ADMIN_PRIVATE_KEY (${relayer.address})`);
    }

    const trusted = await new ethers.Contract(forwardRequest.to, TRUST_ABI, provider)
      .isTrustedForwarder(FORWARDER_ADDRESS)
      .catch(() => false);
    if (!trusted) {
      return res.status(503).json({ error: 'Contract does not support gasless transactions', fallback: true });
    }

    const forwarder = new ethers.Contract(FORWARDER_ADDRESS, FORWARDER_ABI, relayer);
    if (!(await forwarder.verify(forwardRequest, signature))) {
      return res.status(400).json({ error: 'Invalid or already used signature. Please try again.' });
    }

    // Simulate first, so reverts ("Already registered", ...) cost the station nothing
    let gasEstimate;
    try {
      gasEstimate = await forwarder.execute.estimateGas(forwardRequest, signature);
    } catch (err) {
      return res.status(400).json({ error: await revertReason(forwarder, forwardRequest, signature, err) });
    }

    const [feeData, balance] = await Promise.all([provider.getFeeData(), provider.getBalance(relayer.address)]);
    const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;
    if (maxFeePerGas > ethers.parseUnits(MAX_FEE_GWEI, 'gwei')) {
      return res.status(503).json({ error: 'Network gas price is too high for the gas station', fallback: true });
    }
    const gasLimit = (gasEstimate * 12n) / 10n;
    if (balance < gasLimit * maxFeePerGas || balance < ethers.parseEther(MIN_BALANCE_ETH)) {
      console.error(`Gas station balance low: ${ethers.formatEther(balance)} ETH at ${relayer.address}`);
      return res.status(503).json({ error: 'Gas station is out of funds', fallback: true });
    }

    // Concurrent relays can race for the admin wallet's account nonce; retry those
    for (let attempt = 1; ; attempt++) {
      try {
        const tx = await forwarder.execute(forwardRequest, signature, { gasLimit });
        console.log(`relayed ${call.name} for ${forwardRequest.from}: ${tx.hash}`);
        return res.status(200).json({ txHash: tx.hash });
      } catch (err) {
        const nonceClash = err.code === 'NONCE_EXPIRED' || err.code === 'REPLACEMENT_UNDERPRICED' ||
          /nonce|underpriced|replace|already known/i.test(err.message || '');
        if (!nonceClash || attempt >= SEND_RETRIES) throw err;
        await new Promise(resolve => setTimeout(resolve, 200 * attempt + Math.random() * 300));
      }
    }

  } catch (err) {
    console.error('relay error:', err);
    return res.status(500).json({ error: 'Gas station error. Please try again.' });
  }
}

/**
 * Some RPC nodes drop revert data from eth_estimateGas; eth_call keeps it.
 */
async function revertReason(forwarder, forwardRequest, signature, estimateErr) {
  if (estimateErr.reason) return estimateErr.reason;
  try {
    await forwarder.execute.staticCall(forwardRequest, signature);
  } catch (err) {
    if (err.reason) return err.reason;
  }
  return 'Transaction would fail';
}
