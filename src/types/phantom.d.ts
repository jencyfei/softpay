/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PublicKey, Transaction } from '@solana/web3.js';

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (
    transaction: Transaction
  ) => Promise<{ signature: string; publicKey: PublicKey }>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  on: (event: string, callback: (args: any) => void) => void;
  request: (args: { method: string; params?: any }) => Promise<any>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}
