import { ethers } from 'ethers';
import { SEPOLIA_CHAIN_ID, SEPOLIA_NETWORK, SEPOLIA_CHAIN_ID_DEC, QUIZ_SCORES_ABI, CONTRACT_ADDRESS } from './abi.js';

let provider = null;
let signer = null;
let connectedAddress = null;
let participantData = null; // { name, xUsername, registered }
let onConnectCallbacks = [];
let onDisconnectCallbacks = [];

// =================== PUBLIC API ===================

export function onWalletConnect(callback) {
  onConnectCallbacks.push(callback);
}

export function onWalletDisconnect(callback) {
  onDisconnectCallbacks.push(callback);
}

export function getProvider() { return provider; }
export function getSigner() { return signer; }
export function getAddress() { return connectedAddress; }
export function isConnected() { return !!connectedAddress; }
export function isRegistered() { return participantData?.registered === true; }
export function getParticipantData() { return participantData; }

export function shortenAddress(addr) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

// =================== CONNECT / DISCONNECT ===================

export async function connectWallet() {
  if (!window.ethereum) {
    showWalletError('MetaMask is not installed! Please install MetaMask from metamask.io');
    return false;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);

    // Request account access
    const accounts = await provider.send('eth_requestAccounts', []);
    if (!accounts || accounts.length === 0) {
      showWalletError('No accounts found. Please unlock MetaMask.');
      return false;
    }

    // Check and switch to Sepolia
    const network = await provider.getNetwork();
    if (Number(network.chainId) !== SEPOLIA_CHAIN_ID_DEC) {
      const switched = await switchToSepolia();
      if (!switched) return false;
      // Re-create provider after network switch
      provider = new ethers.BrowserProvider(window.ethereum);
    }

    signer = await provider.getSigner();
    connectedAddress = await signer.getAddress();

    // Check registration status on-chain
    await checkRegistration();

    // Notify listeners
    onConnectCallbacks.forEach(cb => cb(connectedAddress));
    updateWalletUI(true);

    // If not registered, prompt registration
    if (!participantData?.registered) {
      showRegistrationModal();
    }

    return true;
  } catch (err) {
    console.error('Wallet connection failed:', err);
    if (err.code === 4001) {
      showWalletError('Connection request was rejected. Please try again.');
    } else {
      showWalletError('Failed to connect wallet. Please try again.');
    }
    return false;
  }
}

export function disconnectWallet() {
  provider = null;
  signer = null;
  connectedAddress = null;
  participantData = null;
  onDisconnectCallbacks.forEach(cb => cb());
  updateWalletUI(false);
}

// =================== REGISTRATION CHECK ===================

async function checkRegistration() {
  if (!CONTRACT_ADDRESS || !connectedAddress) {
    participantData = { registered: false };
    return;
  }

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, QUIZ_SCORES_ABI, provider);
    const registered = await contract.isRegistered(connectedAddress);

    if (registered) {
      const data = await contract.getParticipant(connectedAddress);
      participantData = {
        name: data.name,
        xUsername: data.xUsername,
        quizScores: data.quizScores,
        registered: true
      };
    } else {
      participantData = { registered: false };
    }
  } catch (err) {
    console.error('Registration check failed:', err);
    participantData = { registered: false };
  }
}

// =================== REGISTRATION MODAL ===================

function showRegistrationModal() {
  const modal = document.getElementById('quiz-modal');
  const content = document.getElementById('quiz-modal-content');

  if (!modal || !content) return;

  content.innerHTML = `
    <div class="quiz-registration">
      <button class="modal-close" id="reg-modal-close">&times;</button>
      <div class="quiz-reg-icon">📝</div>
      <h2>Register as Participant</h2>
      <p class="quiz-reg-subtitle">Link your name and X username to your wallet. This is permanent and stored on-chain.</p>

      <div class="quiz-reg-form">
        <div class="form-group">
          <label for="reg-name">Your Name <span class="required">*</span></label>
          <input type="text" id="reg-name" placeholder="Enter your full name" required autocomplete="name" maxlength="64" />
        </div>
        <div class="form-group">
          <label for="reg-x-username">X (Twitter) Username <span class="required">*</span></label>
          <div class="input-with-prefix">
            <span class="input-prefix">@</span>
            <input type="text" id="reg-x-username" placeholder="username" required maxlength="32" />
          </div>
        </div>
      </div>

      <div class="quiz-scoring-info">
        <h4>⚠️ Important</h4>
        <ul>
          <li>Your name and X username <strong>cannot be changed</strong> after registration.</li>
          <li>Each X username can only be used <strong>once</strong>.</li>
          <li>Registration is a <strong>blockchain transaction</strong> (requires Sepolia ETH for gas).</li>
        </ul>
      </div>

      <button class="btn btn-primary btn-lg" id="reg-submit-btn">
        🔗 Register On-Chain
      </button>
      <p class="quiz-reg-note" id="reg-status">This will send a transaction from your connected wallet.</p>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  document.getElementById('reg-modal-close').onclick = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.getElementById('reg-submit-btn').onclick = handleRegistration;

  // Enter key support
  content.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('reg-submit-btn').click();
    });
  });
}

async function handleRegistration() {
  const nameInput = document.getElementById('reg-name');
  const xInput = document.getElementById('reg-x-username');
  const submitBtn = document.getElementById('reg-submit-btn');
  const statusEl = document.getElementById('reg-status');

  const name = nameInput.value.trim();
  let xUsername = xInput.value.trim();

  if (!name) { shakeInput('reg-name'); return; }
  if (!xUsername) { shakeInput('reg-x-username'); return; }

  // Strip @ prefix if present
  xUsername = xUsername.startsWith('@') ? xUsername.slice(1) : xUsername;

  if (!CONTRACT_ADDRESS) {
    statusEl.textContent = '⚠️ Contract not configured. Set VITE_CONTRACT_ADDRESS in .env';
    statusEl.style.color = '#F97316';
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Registering...';
    statusEl.textContent = '⏳ Confirm the transaction in MetaMask...';
    statusEl.style.color = '#7235ED';

    const contract = new ethers.Contract(CONTRACT_ADDRESS, QUIZ_SCORES_ABI, signer);
    const tx = await contract.register(name, xUsername);

    statusEl.textContent = '⏳ Transaction submitted! Waiting for confirmation...';
    await tx.wait();

    // Update local state
    participantData = { name, xUsername, registered: true, quizScores: [0n, 0n, 0n, 0n] };

    submitBtn.innerHTML = '✅ Registered!';
    submitBtn.classList.add('success');
    statusEl.innerHTML = `✅ Registration complete! <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank" rel="noopener">View on Etherscan ↗</a>`;
    statusEl.style.color = '#80DF98';

    // Close modal after 2 seconds
    setTimeout(() => {
      const modal = document.getElementById('quiz-modal');
      modal.classList.remove('active');
      document.body.style.overflow = '';

      window.dispatchEvent(new CustomEvent('app-notification', {
        detail: { message: `Welcome, ${name}! You're now registered. Take a quiz!`, type: 'success' }
      }));
    }, 2000);

  } catch (err) {
    console.error('Registration failed:', err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🔗 Retry Registration';

    if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
      statusEl.textContent = '❌ Transaction rejected. Please try again.';
    } else if (err.reason?.includes('already taken') || err.message?.includes('already taken')) {
      statusEl.textContent = '❌ This X username is already registered to another wallet.';
    } else if (err.reason?.includes('Already registered') || err.message?.includes('Already registered')) {
      statusEl.textContent = '❌ This wallet is already registered.';
      // Re-check registration
      await checkRegistration();
      if (participantData?.registered) {
        setTimeout(() => {
          const modal = document.getElementById('quiz-modal');
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }, 1500);
      }
    } else {
      statusEl.textContent = `❌ Error: ${err.reason || err.message || 'Registration failed'}`;
    }
    statusEl.style.color = '#ef4444';
  }
}

function shakeInput(id) {
  const el = document.getElementById(id);
  el.classList.add('shake');
  el.focus();
  setTimeout(() => el.classList.remove('shake'), 500);
}

// =================== NETWORK SWITCHING ===================

async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }]
    });
    return true;
  } catch (switchError) {
    // Chain not added - add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SEPOLIA_NETWORK]
        });
        return true;
      } catch (addError) {
        showWalletError('Failed to add Sepolia network to MetaMask.');
        return false;
      }
    }
    showWalletError('Please switch to Sepolia testnet in MetaMask.');
    return false;
  }
}

// =================== EVENT LISTENERS ===================

export function initWalletListeners() {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      // Re-connect with new account
      connectWallet();
    }
  });

  window.ethereum.on('chainChanged', () => {
    // Reload page on chain change (recommended by MetaMask)
    window.location.reload();
  });
}

// =================== UI HELPERS ===================

function updateWalletUI(connected) {
  const btn = document.getElementById('wallet-connect-btn');
  const addrEl = document.getElementById('wallet-address');
  const statusDot = document.getElementById('wallet-status-dot');

  if (!btn) return;

  if (connected) {
    btn.textContent = 'Disconnect';
    btn.classList.add('connected');
    btn.onclick = disconnectWallet;
    if (addrEl) addrEl.textContent = shortenAddress(connectedAddress);
    if (statusDot) statusDot.classList.add('active');
  } else {
    btn.textContent = 'Connect Wallet';
    btn.classList.remove('connected');
    btn.onclick = connectWallet;
    if (addrEl) addrEl.textContent = '';
    if (statusDot) statusDot.classList.remove('active');
  }
}

function showWalletError(msg) {
  // Use the global notification system
  const event = new CustomEvent('app-notification', {
    detail: { message: msg, type: 'error' }
  });
  window.dispatchEvent(event);
}
