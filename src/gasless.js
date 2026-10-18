import { ethers } from 'ethers';
import { FORWARDER_ADDRESS, SEPOLIA_CHAIN_ID_DEC, SEPOLIA_RPC_URL } from './abi.js';

// Gasless transactions (ERC-2771). The participant signs an EIP-712
// ForwardRequest in MetaMask (no gas, no ETH needed), and /api/relay submits
// it through GaslessForwarder.sol, paid for by the gas station wallet.
// Contracts that don't trust the forwarder get a normal wallet transaction.

// Must match GaslessForwarder.sol
const FORWARD_REQUEST_TYPES = {
  ForwardRequest: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'data', type: 'bytes' }
  ]
};
const REQUEST_TTL_SECONDS = 60 * 60;
const RECEIPT_TIMEOUT_MS = 3 * 60 * 1000;

let readProvider = null;
const trustCache = new Map(); // contract address => Promise<bool>

/**
 * Call a state-changing contract function, gasless when possible.
 * @returns {Promise<{hash: string, wait: () => Promise<object>}>} Same shape as
 *          an ethers TransactionResponse, so callers can `await tx.wait()`.
 */
export async function sendContractTx(signer, address, abi, method, args) {
  if (await isGasless(address)) {
    const relayed = await relay(signer, address, abi, method, args);
    if (relayed) return relayed;
  }
  const contract = new ethers.Contract(address, abi, signer);
  return contract[method](...args);
}

/**
 * Whether calls to `address` are paid for by the gas station.
 */
export function isGasless(address) {
  if (!FORWARDER_ADDRESS || !address) return Promise.resolve(false);

  const key = address.toLowerCase();
  if (!trustCache.has(key)) {
    const contract = new ethers.Contract(address, ['function isTrustedForwarder(address) view returns (bool)'], getReadProvider());
    trustCache.set(key, contract.isTrustedForwarder(FORWARDER_ADDRESS).catch((err) => {
      // A revert means a contract without ERC-2771 support; retry anything else next time
      if (err.code !== 'CALL_EXCEPTION' && err.code !== 'BAD_DATA') trustCache.delete(key);
      return false;
    }));
  }
  return trustCache.get(key);
}

/**
 * Sign a ForwardRequest and hand it to the gas station.
 * Returns null when the gas station can't sponsor it right now (out of
 * funds, gas too expensive), so the caller can fall back to a direct tx.
 */
async function relay(signer, address, abi, method, args) {
  const from = await signer.getAddress();
  const request = {
    from,
    to: address,
    nonce: BigInt(ethers.hexlify(ethers.randomBytes(32))),
    deadline: BigInt(Math.floor(Date.now() / 1000) + REQUEST_TTL_SECONDS),
    data: new ethers.Interface(abi).encodeFunctionData(method, args)
  };
  const domain = {
    name: 'Road2DevConForwarder',
    version: '1',
    chainId: SEPOLIA_CHAIN_ID_DEC,
    verifyingContract: FORWARDER_ADDRESS
  };

  const signature = await signer.signTypedData(domain, FORWARD_REQUEST_TYPES, request);

  const resp = await fetch('/api/relay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      request: { ...request, nonce: request.nonce.toString(), deadline: request.deadline.toString() },
      signature
    })
  });
  const body = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    if (body.fallback) {
      console.warn('Gas station unavailable, sending a regular transaction:', body.error);
      return null;
    }
    const err = new Error(body.error || 'Gas station request failed');
    err.reason = body.error;
    throw err;
  }

  return {
    hash: body.txHash,
    wait: () => waitForReceipt(body.txHash)
  };
}

async function waitForReceipt(hash) {
  const receipt = await getReadProvider().waitForTransaction(hash, 1, RECEIPT_TIMEOUT_MS);
  if (!receipt || receipt.status !== 1) {
    const err = new Error('Transaction failed on-chain');
    err.reason = err.message;
    throw err;
  }
  return receipt;
}

function getReadProvider() {
  if (!readProvider) readProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  return readProvider;
}
