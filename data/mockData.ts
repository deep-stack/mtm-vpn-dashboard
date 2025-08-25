import { Transaction, BridgeTransaction, SwapTransaction, AccountBalance, AppDownload, SupportTicket, DashboardStats } from '../types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    transactionHash: '2AUxZpuQqR7pYyuYcYqwbGHFgJfbvGRJfrGW1D4RSbVeHBprrCoVBb8YEb7uYAiGTL7tGLWYAbaJZjmxetDCpW9o',
    fromAddress: 'HmWkGTaLQXzqDUVUThqSksp2gRYupRGKegJ4TZzBgEHi',
    nymTransactionHash: '4E169C934D2782EC35DCC1BBB578FF543B081B06E76D8C030B75ACD3EDE590F8',
    createdAt: new Date('2025-08-24T10:30:00Z')
  },
  {
    id: '2', 
    transactionHash: '3bVxNqrQsR8qZzrYdYrxcGHFgKgcwGTKgrHX2E5STdWfICqssEpVCc9ZFc8vZBjHTM8uHLXYBcbKam4yguEidl9P',
    fromAddress: 'JkXlRgaQTbzfMcXvRuTyFqPmLdGhGfKjVnBxEzRgQaFi',
    nymTransactionHash: '7F259D847F3892FD46EDD2CCC689GG654C192C17F87E9D141C86BDE4FEF701G9',
    createdAt: new Date('2025-08-24T09:15:00Z')
  },
  {
    id: '3',
    transactionHash: '4CWyOrsTt9rAarZeEasydIGGhKheaHTLhsIY3F6TUeXgJDrtfFqWDd0AhGd9wCkIUN9vIMYZCdcLbm5zhvFjelqQ',
    fromAddress: 'MnYmShbRUczgOfYwSvUzGrRnHfHmGgLkWoCzF1ShRbGj',
    error: 'Insufficient NYM balance in service wallet',
    createdAt: new Date('2025-08-24T08:45:00Z')
  }
];

export const mockBridgeTransactions: BridgeTransaction[] = [
  {
    id: 1,
    nymAmount: '125.5',
    ethTransactionHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    createdAt: new Date('2025-08-24T11:00:00Z')
  },
  {
    id: 2,
    nymAmount: '67.25',
    ethTransactionHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    createdAt: new Date('2025-08-24T10:20:00Z')
  },
  {
    id: 3,
    nymAmount: '200.0',
    error: 'Bridge transaction failed: Network congestion',
    createdAt: new Date('2025-08-24T09:30:00Z')
  }
];

export const mockSwapTransactions: SwapTransaction[] = [
  {
    id: 1,
    ethAmount: '0.05',
    transactionHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    createdAt: new Date('2025-08-24T12:15:00Z')
  },
  {
    id: 2,
    ethAmount: '0.025',
    transactionHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    createdAt: new Date('2025-08-24T11:40:00Z')
  },
  {
    id: 3,
    ethAmount: '0.1',
    error: 'Swap failed: Slippage too high',
    createdAt: new Date('2025-08-24T10:55:00Z')
  }
];

export const mockAccountBalances: AccountBalance[] = [
  {
    asset: 'ETH',
    balance: '2.456789',
    address: '0x742d35Cc643C0532E6A8b32F4F5bbFB6C6e13aE2'
  },
  {
    asset: 'NYM',
    balance: '15234.789123',
    address: 'n1sdnrq62m07gcwzpfmdgvqfpqqjvtnnllcypur8'
  }
];

export const mockAppDownloads: AppDownload[] = [
  {
    id: '1',
    version: 'v1.8.0-mtm-0.1.2',
    platform: 'Android',
    downloads: 1247,
    releaseDate: new Date('2025-08-19'),
    fileSize: '111 MiB'
  },
  {
    id: '2',
    version: 'v1.7.5-mtm-0.1.1',
    platform: 'Android',
    downloads: 892,
    releaseDate: new Date('2025-08-10'),
    fileSize: '108 MiB'
  },
  {
    id: '3',
    version: 'v1.6.2-mtm-0.1.0',
    platform: 'Android',
    downloads: 634,
    releaseDate: new Date('2025-07-28'),
    fileSize: '105 MiB'
  },
  {
    id: '4',
    version: 'v1.8.0-mtm-0.1.2',
    platform: 'iOS',
    downloads: 456,
    releaseDate: new Date('2025-08-20'),
    fileSize: '127 MiB'
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    userId: 'user_123',
    email: 'john.doe@example.com',
    subject: 'Unable to connect to VPN servers',
    message: 'I\'ve been trying to connect to VPN servers for the past 2 hours but keep getting connection timeout errors. Please help.',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2025-08-24T14:30:00Z'),
    updatedAt: new Date('2025-08-24T14:30:00Z'),
    responses: []
  },
  {
    id: '2',
    userId: 'user_456',
    email: 'jane.smith@example.com',
    subject: 'Transaction failed but MTM tokens were deducted',
    message: 'I sent 50 MTM tokens but the transaction shows as failed, however the tokens are missing from my wallet.',
    status: 'in-progress',
    priority: 'critical',
    createdAt: new Date('2025-08-24T13:15:00Z'),
    updatedAt: new Date('2025-08-24T13:45:00Z'),
    responses: [
      {
        id: 'resp_1',
        ticketId: '2',
        message: 'We are investigating this issue. Can you please provide the transaction hash?',
        isAdminResponse: true,
        createdAt: new Date('2025-08-24T13:45:00Z')
      }
    ]
  },
  {
    id: '3',
    userId: 'user_789',
    email: 'mike.wilson@example.com',
    subject: 'Feature request: Dark mode support',
    message: 'Would love to see dark mode support in the VPN app. The current bright theme is hard on the eyes during night usage.',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date('2025-08-23T16:20:00Z'),
    updatedAt: new Date('2025-08-24T10:00:00Z'),
    responses: [
      {
        id: 'resp_2',
        ticketId: '3',
        message: 'Thank you for the suggestion! Dark mode is planned for the next major release.',
        isAdminResponse: true,
        createdAt: new Date('2025-08-24T10:00:00Z')
      }
    ]
  }
];

export const mockDashboardStats: DashboardStats = {
  totalTransactions: 1247,
  successfulTransactions: 1189,
  failedTransactions: 58,
  totalVolume: '2,456,789.12',
  activeUsers: 3420,
  totalDownloads: 3229
};