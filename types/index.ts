export interface Transaction {
  id: string;
  transactionHash: string;
  fromAddress: string;
  nymTransactionHash?: string;
  error?: string;
  createdAt: Date;
}

export interface BridgeTransaction {
  id: number;
  nymAmount: string;
  ethTransactionHash?: string;
  error?: string;
  createdAt: Date;
}

export interface SwapTransaction {
  id: number;
  ethAmount: string;
  transactionHash?: string;
  error?: string;
  createdAt: Date;
}

export interface AccountBalance {
  asset: 'ETH' | 'NYM';
  balance: string;
  address: string;
}

export interface AppDownload {
  id: string;
  version: string;
  platform: 'Android' | 'iOS' | 'Windows' | 'macOS' | 'Linux';
  downloads: number;
  releaseDate: Date;
  fileSize: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  message: string;
  isAdminResponse: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalVolume: string;
  activeUsers: number;
  totalDownloads: number;
}