import { Transaction, BridgeTransaction, SwapTransaction, AccountBalance, AppDownload, DashboardStats } from '../types';

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
    error: 'insufficient funds: got 100unym, required 1000unym',
    createdAt: new Date('2025-08-24T08:45:00Z')
  },
  {
    id: '4',
    transactionHash: '5DXzPstUu0rBbsaZcZsycJHIhLjdxIULhsJZ4G7TUfYhJErttGqXEd1BiIe0xDlJVnOvJNZaCeCMcm6ajvHkfmrR',
    fromAddress: 'NpZnTicSVd0gPdZyTyU0HsSmMeHnHhMlXpDzG2TicRiJ',
    nymTransactionHash: '8G360E958G4903GE47FEE3DDD7901H765D203D28G98F0E252D97CEF5GFG812H0',
    createdAt: new Date('2025-08-24T07:20:00Z')
  },
  {
    id: '5',
    transactionHash: '6EYqRtuVv1sDbtraBdatdKIJiMkeyJVMitKa5H8UVgZiKFsuuHrYFe2CjJf1yEkKWoMaKOZbDfFNdn7bkvIlgorS',
    fromAddress: 'OqAoUjdTWe1hQeaUzVV1ItTnNfIoIiNmYqEaH3UjdSjK',
    error: 'account sequence mismatch, expected 42, got 41',
    createdAt: new Date('2025-08-24T06:45:00Z')
  },
  {
    id: '6',
    transactionHash: '7FZsSwvWw2tEcusbCebudLJKjNkfzKWNjuLb6I9VWhajLGtvvIsZGf3DkKg2zFlLXqZbLPZcEgGOdo8clwJmhpsT',
    fromAddress: 'PrBpVkeUXf2iRfbV0WW2JuUoPgJpJjOnZrFbI4VkeTkL',
    nymTransactionHash: '9H471F069H5014HF58GFF4EEE8012I876E314E39H09G1F363E08DFG6HGH023I1',
    createdAt: new Date('2025-08-24T05:30:00Z')
  },
  {
    id: '7',
    transactionHash: '8GAtTxwXx3uFdvtcDfcveMLLkOlg0LXOkvMc7J0WXibkMHuwwJtaHg4ElLh3AFmMYrAcMQAdFhHPeq9dmxKniqtU',
    fromAddress: 'QsCqWlfVYg3jSgcW1XX3KvVpQhKqKkPpAsGcJ5WlfUlM',
    nymTransactionHash: 'AI582G17AI6125IG69HGG5FFF9123J987F425F4AI1AH2G474F19EGH7IHI134J2',
    createdAt: new Date('2025-08-24T04:15:00Z')
  },
  {
    id: '8',
    transactionHash: '9HBuUyxYy4vGewudEgdwfNMMlPmh1MYPlwNd8K1XYjclNIvxxKubIh5FmMi4BGnNZsBdNRBeFiIQfr0eoyLofsVU',
    fromAddress: 'RtDrXmgWZh4kThcX2YY4LwWqRiLrLlQrBtHdK6XmgVmN',
    error: 'insufficient funds: got 50unym, required 250unym',
    createdAt: new Date('2025-08-24T03:00:00Z')
  },
  {
    id: '9',
    transactionHash: 'ACVwZzyZ5wHfxveEhdxgONNmNqmiBNaQmOe9L2YZkdmOJwyxLvcJi6GnNj5CHoOAtCeOSCfGjJRgs1fqzMqgtWV',
    fromAddress: 'SuEsYnhXai5lUidY3ZZ5MxXsSkMsLmRSCuIeL7YnhWnO',
    nymTransactionHash: 'BJ693H28BJ7236JH7AIIH6GGG0234K098G536G5BJ2BI3H585G20FHI8JIJ245K3',
    createdAt: new Date('2025-08-24T02:45:00Z')
  },
  {
    id: '10',
    transactionHash: 'BDCxA00a6xIgywxfFiegGOOoOrnoDObRynPf0M3aalmPKxzMwdKj7HoOk6DIpPatDeP0TCgHkKSht2grANruuXW',
    fromAddress: 'TvFtZoiYbj6mVjeZ4Aa6NyYtTlNtMnStDvJfM8ZoiXoP',
    error: 'tx parse error: invalid transaction format',
    createdAt: new Date('2025-08-24T01:30:00Z')
  },
  {
    id: '11',
    transactionHash: 'CEDyB11b7yJhzygGjfzgGPPpPsopEPcSzoPg1N4bmpoPLyyNxeeLk8IpPl7EJqPbuEfQ1UDhIlLTiu3hsOsVwwYX',
    fromAddress: 'UwGuapjZck7nWkfa5Bb7OzZuUmOuNoTuEwKgN9apjYpQ',
    nymTransactionHash: 'CK704I39CK8347KI8BJJI7HHH1345L109H647H6CK3CJ4I696H31GJJ9KJK356L4',
    createdAt: new Date('2025-08-24T00:15:00Z')
  },
  {
    id: '12',
    transactionHash: 'DFEzC22c8zKi0zhHkgAgHQQqQtqpFQdT0qQh2O5cnpqQMzzOyfFMl9JqQm8FKrQcvFgR2VEiJmMUjv4itPtWxxZY',
    fromAddress: 'VxHvbqkai8oXlgb6CcC8P0avVnPvOpUvFxLhO0bqkZqR',
    error: 'gas wanted 200000 exceeds block gas limit 100000',
    createdAt: new Date('2025-08-23T23:00:00Z')
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
    error: 'execution reverted: insufficient allowance',
    createdAt: new Date('2025-08-24T09:30:00Z')
  },
  {
    id: 4,
    nymAmount: '89.75',
    error: 'nonce too low',
    createdAt: new Date('2025-08-24T08:15:00Z')
  },
  {
    id: 5,
    nymAmount: '156.0',
    error: 'insufficient funds for gas * price + value',
    createdAt: new Date('2025-08-24T07:45:00Z')
  },
  {
    id: 6,
    nymAmount: '78.3',
    ethTransactionHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    createdAt: new Date('2025-08-24T06:30:00Z')
  },
  {
    id: 7,
    nymAmount: '245.8',
    ethTransactionHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    createdAt: new Date('2025-08-24T05:15:00Z')
  },
  {
    id: 8,
    nymAmount: '132.4',
    error: 'execution reverted: transfer amount exceeds balance',
    createdAt: new Date('2025-08-24T04:00:00Z')
  },
  {
    id: 9,
    nymAmount: '98.7',
    ethTransactionHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    createdAt: new Date('2025-08-24T02:45:00Z')
  },
  {
    id: 10,
    nymAmount: '187.9',
    error: 'max fee per gas less than block base fee',
    createdAt: new Date('2025-08-24T01:30:00Z')
  },
  {
    id: 11,
    nymAmount: '67.5',
    ethTransactionHash: '0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    createdAt: new Date('2025-08-23T23:15:00Z')
  },
  {
    id: 12,
    nymAmount: '298.2',
    ethTransactionHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    createdAt: new Date('2025-08-23T22:00:00Z')
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
    error: 'transaction underpriced: gas price too low',
    createdAt: new Date('2025-08-24T10:55:00Z')
  },
  {
    id: 5,
    ethAmount: '0.03',
    error: 'replacement transaction underpriced',
    createdAt: new Date('2025-08-24T08:30:00Z')
  },
  {
    id: 6,
    ethAmount: '0.08',
    transactionHash: '0x8901abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
    createdAt: new Date('2025-08-24T07:15:00Z')
  },
  {
    id: 7,
    ethAmount: '0.12',
    transactionHash: '0x901abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    createdAt: new Date('2025-08-24T06:00:00Z')
  },
  {
    id: 8,
    ethAmount: '0.045',
    error: 'execution reverted: pool insufficient liquidity',
    createdAt: new Date('2025-08-24T04:45:00Z')
  },
  {
    id: 9,
    ethAmount: '0.09',
    transactionHash: '0xa01bcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789',
    createdAt: new Date('2025-08-24T03:30:00Z')
  },
  {
    id: 10,
    ethAmount: '0.067',
    error: 'gas limit reached',
    createdAt: new Date('2025-08-24T02:15:00Z')
  },
  {
    id: 11,
    ethAmount: '0.15',
    transactionHash: '0xb01cdef1234567890abcdef1234567890abcdef1234567890abcdef123456789a',
    createdAt: new Date('2025-08-24T01:00:00Z')
  },
  {
    id: 12,
    ethAmount: '0.055',
    error: 'execution reverted: deadline expired',
    createdAt: new Date('2025-08-23T23:45:00Z')
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
  }
];
