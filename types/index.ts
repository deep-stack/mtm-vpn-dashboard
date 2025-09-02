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


export interface DashboardStats {
  totalConversions: number;
  successfulConversions: number;
  failedConversions: number;
  totalDownloads: number;
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  month: string;
  totalConversions: number;
  successfulConversions: number;
  failedConversions: number;
}