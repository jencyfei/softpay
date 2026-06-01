/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';

// Jency's wallet address
export const CREATOR_WALLET_ADDRESS = '5HzpKNbnRE7gwSPEmeKpwQbCoG3k9w';

// Solana Devnet connection
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

/**
 * Check if Phantom wallet is installed
 */
export const isPhantomInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.solana?.isPhantom === true;
};

/**
 * Get Phantom provider
 */
export const getPhantomProvider = () => {
  if (!isPhantomInstalled()) {
    throw new Error('Phantom wallet is not installed. Please install it from https://phantom.app/');
  }
  return window.solana!;
};

/**
 * Connect to Phantom wallet
 */
export const connectPhantomWallet = async (): Promise<{ publicKey: string; address: string }> => {
  try {
    const provider = getPhantomProvider();
    const response = await provider.connect();
    const publicKey = response.publicKey.toString();
    
    return {
      publicKey,
      address: publicKey.slice(0, 9) + '...' + publicKey.slice(-4),
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

/**
 * Disconnect from Phantom wallet
 */
export const disconnectPhantomWallet = async (): Promise<void> => {
  try {
    const provider = getPhantomProvider();
    await provider.disconnect();
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    throw error;
  }
};

/**
 * Convert USD amount to SOL (simplified conversion for Devnet)
 * In production, you would use a real-time price oracle
 */
export const usdToSol = (usdAmount: number): number => {
  // Simplified conversion: 1 SOL = $100 USD (for Devnet testing)
  // Adjust this ratio based on your needs
  return usdAmount / 100;
};

/**
 * Create and send a SOL transfer transaction
 */
export const sendSolTransaction = async (
  amountUSD: number
): Promise<{ signature: string; amount: number }> => {
  try {
    const provider = getPhantomProvider();
    
    if (!provider.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Convert USD to SOL
    const solAmount = usdToSol(amountUSD);
    const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);

    // CRITICAL FIX: Ensure both sender and receiver are PublicKey objects
    const senderPubkey = new PublicKey(provider.publicKey.toString());
    const recipientPubkey = new PublicKey(CREATOR_WALLET_ADDRESS);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');

    // Create transaction with properly instantiated PublicKey objects
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: senderPubkey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: senderPubkey,
        toPubkey: recipientPubkey,
        lamports,
      })
    );

    // Sign and send transaction
    const { signature } = await provider.signAndSendTransaction(transaction);

    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');

    return {
      signature,
      amount: solAmount,
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};

/**
 * Get wallet balance in SOL
 */
export const getWalletBalance = async (publicKey: string): Promise<number> => {
  try {
    const pubkey = new PublicKey(publicKey);
    const balance = await connection.getBalance(pubkey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Failed to get balance:', error);
    return 0;
  }
};

/**
 * Format transaction signature for display
 */
export const formatSignature = (signature: string): string => {
  if (signature.length < 20) return signature;
  return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
};

/**
 * Get Solana Explorer URL for transaction
 */
export const getExplorerUrl = (signature: string, cluster: 'devnet' | 'mainnet-beta' = 'devnet'): string => {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
};
