import type { WalletTransaction, TransactionStatus } from '@/types';
import { walletTransactions } from '@/constants/workerMockData';

export interface WalletBalance {
  available: string;
  pending: string;
  totalEarned: string;
}

export async function getWalletBalance(workerId: string): Promise<WalletBalance> {
  // TODO: GET /wallet/:workerId/balance
  console.log('[wallet] getWalletBalance placeholder for', workerId);
  return {
    available: '₱12,450',
    pending: '₱950',
    totalEarned: '₱48,200',
  };
}

export async function getTransactions(workerId: string): Promise<WalletTransaction[]> {
  // TODO: GET /wallet/:workerId/transactions
  console.log('[wallet] getTransactions placeholder for', workerId);
  return walletTransactions;
}

export async function requestPayout(
  workerId: string,
  amount: number,
  methodId: string,
): Promise<{ success: boolean; status: TransactionStatus }> {
  // TODO: POST /wallet/:workerId/payout
  console.log('[wallet] requestPayout placeholder', workerId, amount, methodId);
  return { success: true, status: 'pending' };
}
