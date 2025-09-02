import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import { 
  ArrowsRightLeftIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CloudArrowDownIcon,
  WalletIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { StargateClient } from '@cosmjs/stargate';
import { Decimal } from '@cosmjs/math';

import Layout from '../../components/Layout';
import dashboardApi, { ApiError, DashboardStats, TransactionData } from '../../utils/api';
import { getExplorerUrl } from '../../utils/explorer';

interface BalanceData {
  address: string;
  balance: number;
  balanceUSD: number | null;
  currency: 'ETH' | 'NYM';
}

export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<TransactionData[]>([]);
  const [accountBalances, setAccountBalances] = useState<BalanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch dashboard data (without balances)
      const [statsData, conversionsData] = await Promise.allSettled([
        dashboardApi.getStats(),
        dashboardApi.getConversions({ limit: 5, status: 'all' })
      ]);

      // Handle dashboard stats
      if (statsData.status === 'fulfilled') {
        setDashboardStats(statsData.value);
        
        // After getting stats, fetch balances using wallet addresses
        if (statsData.value.walletAddresses) {
          fetchAccountBalances(statsData.value.walletAddresses);
        }
      } else {
        console.error('Failed to fetch dashboard stats:', statsData.reason);
      }

      // Handle recent transactions
      if (conversionsData.status === 'fulfilled') {
        setRecentTransactions(conversionsData.value.transactions);
      } else {
        console.error('Failed to fetch recent transactions:', conversionsData.reason);
      }

    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API Error: ${err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountBalances = async (walletAddresses: { eth?: string; nym: string }) => {
    const balances: BalanceData[] = [];

    try {
      // Fetch ETH balance if address is provided
      if (walletAddresses.eth) {
        try {
          // Use NextJS API proxy to bypass CORS
          const rpcResponse = await axios.post('/api/eth-rpc', {
            method: 'eth_getBalance',
            params: [walletAddresses.eth, 'latest'],
            jsonrpc: '2.0',
            id: 1
          });
          
          if (rpcResponse.data.error) {
            throw new Error(`RPC Error: ${rpcResponse.data.error.message}`);
          }
          
          const balance = ethers.BigNumber.from(rpcResponse.data.result);
          const ethBalance = parseFloat(ethers.utils.formatEther(balance));
          
          // Get ETH price from CoinGecko (free API)
          let ethBalanceUSD = null;
          try {
            const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            const ethPrice = priceResponse.data.ethereum.usd;
            ethBalanceUSD = parseFloat((ethBalance * ethPrice).toFixed(2));
          } catch (priceError) {
            console.warn('Failed to fetch ETH price:', priceError);
          }
          
          balances.push({
            address: walletAddresses.eth,
            balance: ethBalance,
            balanceUSD: ethBalanceUSD,
            currency: 'ETH'
          });
        } catch (error) {
          console.error('Failed to fetch ETH balance:', error);
        }
      }

      // Fetch NYM balance
      try {
        // Use configurable NYX RPC endpoint
        const nyxRpcUrl = process.env.NEXT_PUBLIC_NYX_RPC_URL!;
        const client = await StargateClient.connect(nyxRpcUrl);
        const balance = await client.getBalance(walletAddresses.nym, 'unym');
        const nymBalance = parseFloat(Decimal.fromAtomics(balance.amount, 6).toString());
        
        // Get NYM price from CoinGecko
        let nymBalanceUSD = null;
        try {
          const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=nym&vs_currencies=usd');
          const nymPrice = priceResponse.data.nym.usd;
          nymBalanceUSD = parseFloat((nymBalance * nymPrice).toFixed(2));
        } catch (priceError) {
          console.warn('Failed to fetch NYM price:', priceError);
        }
        
        balances.push({
          address: walletAddresses.nym,
          balance: nymBalance,
          balanceUSD: nymBalanceUSD,
          currency: 'NYM'
        });
      } catch (error) {
        console.error('Failed to fetch NYM balance:', error);
      }

      setAccountBalances(balances);
    } catch (error) {
      console.error('Error fetching account balances:', error);
    }
  };

  const getStats = () => {
    if (!dashboardStats) return [];
    
    return [
      {
        id: 1,
        name: 'Total MTM to NYM Conversions',
        stat: dashboardStats.totalConversions.toLocaleString(),
        icon: ArrowsRightLeftIcon,
      },
      {
        id: 2,
        name: 'Successful Conversions',
        stat: dashboardStats.successfulConversions.toLocaleString(),
        icon: CheckCircleIcon,
      },
      {
        id: 3,
        name: 'Failed Conversions',
        stat: dashboardStats.failedConversions.toLocaleString(),
        icon: XCircleIcon,
      },
      {
        id: 4,
        name: 'Total Downloads',
        stat: dashboardStats.totalDownloads.toLocaleString(),
        icon: CloudArrowDownIcon,
      },
    ];
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchDashboardData}
                  className="bg-red-100 px-2 py-1 text-sm text-red-800 rounded hover:bg-red-200"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = getStats();
  return (
    <Layout>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard Overview</h1>
          
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8">
            {stats.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-blue-500 p-3">
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                </dt>
                <dd className="ml-16 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                </dd>
              </div>
            ))}
          </div>

          {/* Charts and Balances */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Transaction Volume Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">MTM to NYM Conversions Trend</h3>
                {dashboardStats && (
                  <div className="h-80 flex items-end justify-between space-x-2 border-b border-l border-gray-200 p-4">
                    {/* Monthly data from API */}
                    {dashboardStats.monthlyData && dashboardStats.monthlyData.map((data, index) => {
                      const maxConversions = Math.max(...dashboardStats.monthlyData.map(d => d.totalConversions));
                      return (
                        <div key={data.month} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t transition-all duration-500"
                            style={{ 
                              height: `${Math.max((data.totalConversions / Math.max(maxConversions, 1)) * 240, 8)}px`,
                              minHeight: '8px'
                            }}
                          />
                          <div className="mt-2 text-xs text-gray-500 font-medium">{data.month}</div>
                          <div className="text-xs text-gray-400">{data.totalConversions.toLocaleString()}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Account Balances */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Balances</h3>
                <div className="space-y-4">
                  {accountBalances.length > 0 ? accountBalances.map((account) => (
                    <div key={account.currency} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <WalletIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">
                              {account.currency} Balance
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-lg font-bold text-gray-900">
                                {account.balance.toLocaleString(undefined, {
                                  minimumFractionDigits: account.currency === 'ETH' ? 4 : 2,
                                  maximumFractionDigits: account.currency === 'ETH' ? 6 : 2,
                                })} {account.currency}
                              </div>
                              {account.balanceUSD && (
                                <div className="text-sm text-gray-500">
                                  ${account.balanceUSD.toLocaleString()} USD
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            {account.address.slice(0, 12)}...{account.address.slice(-12)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <a 
                          href={account.currency === 'ETH' ? 
                            `https://etherscan.io/address/${account.address}` : 
                            `https://nym.com/explorer/account/${account.address}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View on {account.currency === 'ETH' ? 'Etherscan' : 'Nym Explorer'} →
                        </a>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-gray-500">
                      Loading balance data...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Conversions */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Conversions</h3>
              <a
                href="/dashboard/transactions"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all →
              </a>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <li key={transaction.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {transaction.error ? (
                          <XCircleIcon className="h-6 w-6 text-red-400" />
                        ) : (
                          <CheckCircleIcon className="h-6 w-6 text-green-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                          <a
                            href={getExplorerUrl(transaction.transactionHash, 'solana')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-mono"
                          >
                            {`${transaction.transactionHash.slice(0, 8)}...${transaction.transactionHash.slice(-8)}`}
                          </a>
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.error ? (
                            `Error: ${transaction.error.substring(0, 40)}...`
                          ) : transaction.nymTransactionHash ? (
                            <div className="flex items-center space-x-2">
                              <span>NYM:</span>
                              <a
                                href={getExplorerUrl(transaction.nymTransactionHash, 'nym')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-mono text-xs"
                              >
                                {`${transaction.nymTransactionHash.slice(0, 8)}...${transaction.nymTransactionHash.slice(-8)}`}
                              </a>
                              <ArrowTopRightOnSquareIcon className="h-3 w-3 text-gray-400" />
                            </div>
                          ) : (
                            `From: ${transaction.fromAddress.slice(0, 8)}...${transaction.fromAddress.slice(-8)}`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-900">
                      <span suppressHydrationWarning>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </Layout>
  );
}
