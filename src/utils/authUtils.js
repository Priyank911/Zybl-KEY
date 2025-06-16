import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { ethers } from 'ethers';

// Available chains configuration
export const supportedChains = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠', supportedWallets: ['metamask', 'walletconnect', 'coinbase'] },
  { id: 'solana', name: 'Solana', icon: '◎', supportedWallets: ['phantom', 'walletconnect'] },
  { id: 'polygon', name: 'Polygon', icon: '⬡', supportedWallets: ['metamask', 'walletconnect', 'coinbase'] },
  { id: 'cosmos', name: 'Cosmos', icon: '✳️', supportedWallets: ['keplr', 'walletconnect'] },
];

// Helper to get chain info
export const getChainInfo = (chainId) => {
  return supportedChains.find(chain => chain.id === chainId) || supportedChains[0];
};

// Helper function to connect wallet and get address
export const connectWallet = async (walletType = 'metamask') => {
  switch (walletType) {
    case 'metamask':
      return connectMetaMaskWallet();
    case 'walletconnect':
      return connectWalletConnect();
    case 'coinbase':
      return connectCoinbaseWallet();
    case 'phantom':
      return connectPhantomWallet();
    case 'keplr':
      return connectKeplrWallet();
    default:
      return connectMetaMaskWallet();
  }
};

// Connect to MetaMask wallet
const connectMetaMaskWallet = async () => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask to continue.");
  }

  try {
    // Request access to the user's Ethereum accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];
    
    console.log("Connected to MetaMask wallet address:", address);
    return address;
  } catch (error) {
    console.error("Error connecting to MetaMask wallet:", error);
    throw error;
  }
};

// Connect to WalletConnect
const connectWalletConnect = async () => {
  try {
    // Import Web3Modal and WalletConnect provider dynamically
    const { EthereumProvider } = await import('@walletconnect/ethereum-provider');
      // Create WalletConnect Provider
    const provider = await EthereumProvider.init({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '5f2f0aefb3eeffa70e08cbea21a6d7e8', // Get from .env.local
      chains: [1], // Default to Ethereum mainnet (1)
      optionalChains: [5, 137, 56, 42161], // Support Goerli testnet (5), Polygon (137), BSC (56), Arbitrum (42161)
      showQrModal: true,
      methods: ['eth_sendTransaction', 'personal_sign', 'eth_sign'],
      events: ['chainChanged', 'accountsChanged'],
    });
    
    // Enable session (connects)
    await provider.enable();
    
    // Get address
    const accounts = await provider.request({ method: 'eth_accounts' });
    const address = accounts[0];
    
    console.log("Connected to WalletConnect wallet address:", address);
    
    // Save the provider for later use
    window.walletConnectProvider = provider;
    
    return address;
  } catch (error) {
    console.error("Error connecting to WalletConnect:", error);
    
    if (error.message?.includes('User closed modal')) {
      throw new Error('Connection cancelled. Please try again.');
    }
    
    throw error;
  }
};

// Connect to Coinbase Wallet
const connectCoinbaseWallet = async () => {
  try {
    // Import CoinbaseWalletSDK dynamically
    const { default: CoinbaseWalletSDK } = await import('@coinbase/wallet-sdk');
    
    // Initialize Coinbase Wallet SDK with proper configuration
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: 'Zybl Passport',
      appLogoUrl: 'https://zybl.io/logo.png', // Use an absolute URL
      darkMode: false
    });
    
    // Create Web3 provider with explicit options
    const chainId = 1; // Ethereum mainnet
    const jsonRpcUrl = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'; // Default RPC URL
    
    // Make sure we're passing the correct parameters in the right order
    const ethereum = coinbaseWallet.makeWeb3Provider(jsonRpcUrl, chainId);
    
    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];
    
    console.log("Connected to Coinbase wallet address:", address);
    
    // Save provider for later use
    window.coinbaseWalletProvider = ethereum;
    
    return address;
  } catch (error) {
    console.error("Error connecting to Coinbase Wallet:", error);
    
    if (error.message?.includes('User denied account authorization')) {
      throw new Error('You rejected the connection request. Please try again.');
    } else if (error.message?.includes('Invalid options')) {
      throw new Error('Configuration error with Coinbase Wallet. Please try a different wallet.');
    }
    
    throw error;
  }
};

// Connect to Phantom wallet for Solana
export const connectPhantomWallet = async () => {
  try {
    // Check if Phantom is installed
    const provider = window?.phantom?.solana;
    
    if (!provider?.isPhantom) {
      throw new Error("Phantom wallet not detected. Please install Phantom to continue.");
    }
    
    // Connect to Phantom
    const response = await provider.connect();
    const address = response.publicKey.toString();
    
    console.log("Connected to Phantom wallet address:", address);
    
    // Save provider for later use
    window.phantomProvider = provider;
    
    return address;
  } catch (error) {
    console.error("Error connecting to Phantom wallet:", error);
    
    if (error.message?.includes('User rejected')) {
      throw new Error('You rejected the connection request. Please try again.');
    }
    
    throw error;
  }
};

// Connect to Keplr wallet for Cosmos
export const connectKeplrWallet = async () => {
  try {
    // Check if Keplr is installed
    if (!window.keplr) {
      throw new Error("Keplr wallet not detected. Please install Keplr to continue.");
    }
    
    // Connect to Keplr (cosmoshub-4 is the main Cosmos chain)
    await window.keplr.enable("cosmoshub-4");
    
    // Get account information
    const offlineSigner = window.keplr.getOfflineSigner("cosmoshub-4");
    const accounts = await offlineSigner.getAccounts();
    const address = accounts[0].address;
    
    console.log("Connected to Keplr wallet address:", address);
    
    // Save for later use
    window.keplrProvider = window.keplr;
    
    return address;
  } catch (error) {
    console.error("Error connecting to Keplr wallet:", error);
    
    if (error.message?.includes('Request rejected')) {
      throw new Error('You rejected the connection request. Please try again.');
    }
    
    throw error;
  }
};

// Helper function to generate a signature for Clerk Web3 authentication
export const generateSignature = async (message, walletType = 'metamask') => {
  try {
    console.log("Message to sign:", message);
    
    let signature;
    
    switch (walletType) {
      case 'metamask':
        // Create ethers provider from window.ethereum
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Sign the message with the connected wallet
        signature = await signer.signMessage(message);
        break;
        
      case 'walletconnect':
        if (!window.walletConnectProvider) {
          throw new Error('WalletConnect provider not initialized');
        }
        
        // Sign with WalletConnect
        signature = await window.walletConnectProvider.request({
          method: 'personal_sign',
          params: [message, window.walletConnectProvider.accounts[0]]
        });
        break;
        
      case 'coinbase':
        if (!window.coinbaseWalletProvider) {
          throw new Error('Coinbase Wallet provider not initialized');
        }
        
        // Sign with Coinbase Wallet
        signature = await window.coinbaseWalletProvider.request({
          method: 'personal_sign',
          params: [message, window.coinbaseWalletProvider.selectedAddress]
        });
        break;
        
      case 'solana':
        signature = await signSolanaMessage(message);
        break;
        
      case 'cosmos':
        signature = await signCosmosMessage(message);
        break;
        
      default:
        throw new Error('Unsupported wallet type');
    }
    
    console.log("Generated signature:", signature);
    
    return signature;
  } catch (error) {
    console.error("Error signing message:", error);
    
    // If the user rejected the signing request
    if (error.code === 4001 || error.message?.includes('user rejected') || error.message?.includes('User denied')) {
      throw new Error('You need to sign the message to authenticate');
    }
    
    throw error;
  }
};

// Helper function for complete Clerk Web3 authentication flow
export const authenticateWithWeb3Wallet = async (signIn, setActive, walletType = 'metamask') => {
  try {
    // 1. Connect to the wallet and get the address
    const address = await connectWallet(walletType);
    console.log("Connected to wallet address:", address);
    
    // Determine the appropriate strategy based on wallet type
    let strategy = 'ethereum';
    if (walletType === 'solana') {
      strategy = 'solana';
    } else if (walletType === 'cosmos') {
      strategy = 'cosmos';
    }
    
    // 2. Create a sign-in if this is the first time signing in with this wallet
    // Note: Clerk will handle sign-in vs sign-up automatically
    const signInAttempt = await signIn.create({
      identifier: address,
      // Explicitly tell Clerk we're using the wallet address as the identifier
      strategy: `web3_${walletType}_signature`,
      redirectUrl: window.location.origin + "/dashboard"
    });
    
    console.log("Sign-in attempt created:", signInAttempt);
    
    // 3. Authenticate with Web3 signature
    const result = await signIn.authenticateWithWeb3({
      strategy,
      address,
      generateSignature: (message) => generateSignature(message, walletType)
    });
    
    console.log("Web3 authentication result:", result);
    
    // 4. Handle the authentication result
    if (result.status === 'complete') {
      console.log('Successfully authenticated with web3!', result);
      
      // Set this session as active
      await setActive({ session: result.createdSessionId });
      return { success: true, address };
    } else {
      console.error('Authentication incomplete:', result);
      throw new Error('Authentication incomplete. Please try again.');
    }
  } catch (error) {
    console.error("Web3 authentication error:", error);
    throw error;
  }
};

// Hook to check if user is authenticated and redirect if needed
export const useAuthCheck = (redirectTo = '/signin') => {
  const { isSignedIn, isLoaded } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        window.location.href = redirectTo;
      } else {
        setIsChecking(false);
      }
    }
  }, [isSignedIn, isLoaded, redirectTo]);

  return { isChecking, isAuthenticated: isSignedIn };
};

// Hook to get current user wallet information
export const useUserWallet = () => {
  const { user } = useAuth();
  
  // Get the primary wallet address or the first available web3 wallet
  const getWalletAddress = () => {
    if (!user) return null;
    
    // If user has web3 wallets in Clerk
    if (user.web3Wallets && user.web3Wallets.length > 0) {
      return user.web3Wallets[0].web3Wallet;
    }
    
    return null;
  };

  // Detect chain based on wallet address format
  const detectChain = () => {
    const address = getWalletAddress();
    if (!address) return 'unknown';

    // Ethereum/EVM addresses are 42 chars (0x + 40 hex chars)
    if (address.startsWith('0x') && address.length === 42) {
      return 'ethereum';
    }
    
    // Solana addresses are base58 encoded and typically ~44 chars
    if (address.length >= 32 && address.length <= 44 && !address.startsWith('0x')) {
      return 'solana';
    }
    
    // Cosmos addresses typically start with cosmos1, osmo1, etc.
    if (address.includes('1') && address.length >= 39 && address.length <= 50) {
      return 'cosmos';
    }
    
    return 'unknown';
  };
  
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const chainInfo = () => {
    const chain = detectChain();
    return supportedChains.find(c => c.id === chain) || { id: 'unknown', name: 'Unknown', icon: '?' };
  };
  
  return {
    walletAddress: getWalletAddress(),
    shortenedAddress: shortenAddress(getWalletAddress()),
    chain: detectChain(),
    chainInfo: chainInfo(),
  };
};

// Helper to extract user profile data
export const getUserProfile = (user) => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.fullName || 'Anonymous User',
    email: user.primaryEmailAddress?.emailAddress || null,
    imageUrl: user.imageUrl || null,
    walletAddress: user.web3Wallets?.[0]?.web3Wallet || null,
  };
};
