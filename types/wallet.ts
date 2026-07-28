export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface WalletTransaction {
  id: string;
  date: string;
  label: string;
  sub: string;
  credit: boolean;
  amount: string;
  status: TransactionStatus;
  type: 'earning' | 'commission' | 'payout' | 'topup';
  reference?: string;
}

export interface BarDatum {
  day: string;
  val: number;
}

export interface PayoutMethod {
  id: string;
  label: string;
  color: string;
  account: string;
  isDefault?: boolean;
}

export interface WorkerPerformance {
  completionRate: number;
  onTimeArrival: number;
  repeatClients: number;
}
