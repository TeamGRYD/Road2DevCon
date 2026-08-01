import { ethers } from 'ethers';
import { SEPOLIA_CHAIN_ID, SEPOLIA_NETWORK, SEPOLIA_CHAIN_ID_DEC } from './abi.js';

let provider = null;
let signer = null;
let connectedAddress = null;
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

    // Notify listeners
    onConnectCallbacks.forEach(cb => cb(connectedAddress));
    updateWalletUI(true);

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
  onDisconnectCallbacks.forEach(cb => cb());
  updateWalletUI(false);
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
