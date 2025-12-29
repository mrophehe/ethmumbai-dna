import { useState, useCallback } from 'react';
import { BrowserProvider, formatEther } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletData {
  address: string;
  balance: string;
  txCount: number;
  ensName: string | null;
  walletAge: number; // in days (estimated from first tx)
}

export interface PersonaData {
  score: number;
  archetype: string;
  mumbaiMode: string;
  gasStyle: string;
  ogEnergy: number;
}

const GAS_STYLES = ['Ninja', 'Hustler', 'Zen Master', 'Speed Demon', 'Diamond Hands'];

function calculatePersona(walletData: WalletData): PersonaData {
  let score = 0;
  
  // Wallet age score (max 25 points)
  if (walletData.walletAge > 1095) score += 25; // 3+ years
  else if (walletData.walletAge > 730) score += 20; // 2+ years
  else if (walletData.walletAge > 365) score += 15; // 1+ year
  else if (walletData.walletAge > 180) score += 10;
  else if (walletData.walletAge > 30) score += 5;

  // TX count score (max 35 points)
  if (walletData.txCount > 1000) score += 35;
  else if (walletData.txCount > 500) score += 30;
  else if (walletData.txCount > 200) score += 25;
  else if (walletData.txCount > 100) score += 20;
  else if (walletData.txCount > 50) score += 15;
  else if (walletData.txCount > 20) score += 10;
  else if (walletData.txCount > 5) score += 5;

  // Balance score (max 25 points)
  const balance = parseFloat(walletData.balance);
  if (balance > 10) score += 25;
  else if (balance > 5) score += 20;
  else if (balance > 1) score += 15;
  else if (balance > 0.5) score += 10;
  else if (balance > 0.1) score += 5;

  // ENS bonus (15 points)
  if (walletData.ensName) score += 15;

  // Ensure score is within bounds
  score = Math.min(100, Math.max(0, score));

  // Map score to persona
  let archetype: string;
  let mumbaiMode: string;
  
  if (score >= 86) {
    archetype = 'Maxi';
    mumbaiMode = 'City Never Sleeps';
  } else if (score >= 66) {
    archetype = 'OG';
    mumbaiMode = 'First-Class Local';
  } else if (score >= 46) {
    archetype = 'Builder';
    mumbaiMode = 'Fast Local';
  } else if (score >= 26) {
    archetype = 'Curious';
    mumbaiMode = 'Share Auto';
  } else {
    archetype = 'Explorer';
    mumbaiMode = 'Tourist';
  }

  // Random gas style based on wallet characteristics
  const gasIndex = (walletData.txCount + walletData.address.charCodeAt(2)) % GAS_STYLES.length;
  const gasStyle = GAS_STYLES[gasIndex];

  return {
    score,
    archetype,
    mumbaiMode,
    gasStyle,
    ogEnergy: score,
  };
}

export function useWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to connect your wallet');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      
      // Get balance
      const balanceWei = await provider.getBalance(address);
      const balance = formatEther(balanceWei);
      
      // Get transaction count
      const txCount = await provider.getTransactionCount(address);
      
      // Try to get ENS name
      let ensName: string | null = null;
      try {
        ensName = await provider.lookupAddress(address);
      } catch {
        // ENS lookup failed, continue without it
      }

      // Estimate wallet age (rough estimate based on tx count and some randomness for demo)
      // In production, you'd query an API like Etherscan for first tx timestamp
      const estimatedAge = Math.min(txCount * 7 + Math.floor(Math.random() * 100), 2000);

      const data: WalletData = {
        address,
        balance: parseFloat(balance).toFixed(4),
        txCount,
        ensName,
        walletAge: estimatedAge,
      };

      setWalletData(data);
      setPersona(calculatePersona(data));
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setWalletData(null);
    setPersona(null);
    setError(null);
  }, []);

  return {
    isConnecting,
    walletData,
    persona,
    error,
    connectWallet,
    reset,
  };
}
