const MTM_SERVICE_URL = process.env.NEXT_PUBLIC_MTM_SERVICE_URL || 'http://localhost:3000';

export interface MonthlyData {
  month: string;
  totalConversions: number;
  successfulConversions: number;
  failedConversions: number;
}

export interface DashboardStats {
  totalConversions: number;
  successfulConversions: number;
  failedConversions: number;
  totalDownloads: number;
  monthlyData: MonthlyData[];
  walletAddresses: {
    eth?: string;
    nym: string;
  };
}

export interface TransactionData {
  id: string;
  transactionHash: string;
  fromAddress: string;
  nymTransactionHash?: string;
  error?: string | null;
  createdAt: string;
}

export interface TransactionsResponse {
  transactions: TransactionData[];
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SwapData {
  id: number;
  ethAmount: string;
  transactionHash?: string;
  error?: string | null;
  createdAt: string;
  bridgeTransaction?: {
    id: number;
    nymAmount: string;
    ethTransactionHash?: string;
    error?: string | null;
  };
}

export interface SwapsResponse {
  swaps: SwapData[];
  totalCount: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${MTM_SERVICE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or parsing errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0
    );
  }
}

export const dashboardApi = {
  // Get dashboard statistics
  getStats: (): Promise<DashboardStats> => apiRequest<DashboardStats>('/api/dashboard/stats'),
  
  // Get conversions with pagination and filtering
  getConversions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }): Promise<TransactionsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.type) searchParams.set('type', params.type);
    
    const query = searchParams.toString();
    const endpoint = `/api/transactions/conversions${query ? `?${query}` : ''}`;
    return apiRequest<TransactionsResponse>(endpoint);
  },

  // Get swaps with pagination and filtering
  getSwaps: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<SwapsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    
    const query = searchParams.toString();
    const endpoint = `/api/swaps${query ? `?${query}` : ''}`;
    return apiRequest<SwapsResponse>(endpoint);
  },

};

export default dashboardApi;