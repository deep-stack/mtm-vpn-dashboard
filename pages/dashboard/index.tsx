// Charts removed for compatibility
import { 
  ArrowsRightLeftIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CurrencyDollarIcon,
  UsersIcon,
  CloudArrowDownIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import Layout from '../../components/Layout';
import { mockDashboardStats, mockTransactions, mockAppDownloads, mockAccountBalances } from '../../data/mockData';

const stats = [
  {
    id: 1,
    name: 'Total MTM to NYM Conversions',
    stat: mockDashboardStats.totalTransactions.toLocaleString(),
    icon: ArrowsRightLeftIcon,
  },
  {
    id: 2,
    name: 'Successful Conversions',
    stat: mockDashboardStats.successfulTransactions.toLocaleString(),
    icon: CheckCircleIcon,
  },
  {
    id: 3,
    name: 'Failed Conversions',
    stat: mockDashboardStats.failedTransactions.toLocaleString(),
    icon: XCircleIcon,
  },
  {
    id: 4,
    name: 'Total Downloads',
    stat: mockDashboardStats.totalDownloads.toLocaleString(),
    icon: CloudArrowDownIcon,
  },
];

// Generate mock chart data
const transactionChartData = [
  { name: 'Jan', conversions: 850 },
  { name: 'Feb', conversions: 920 },
  { name: 'Mar', conversions: 1150 },
  { name: 'Apr', conversions: 980 },
  { name: 'May', conversions: 1200 },
  { name: 'Jun', conversions: 1350 },
  { name: 'Jul', conversions: 1180 },
  { name: 'Aug', conversions: mockDashboardStats.totalTransactions },
];

const downloadChartData = mockAppDownloads.map(download => ({
  version: download.version,
  downloads: download.downloads,
  platform: download.platform,
}));

export default function Dashboard() {
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
                <div className="h-80 flex items-end justify-between space-x-2 border-b border-l border-gray-200 p-4">
                  {transactionChartData.map((data, index) => (
                    <div key={data.name} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-500"
                        style={{ 
                          height: `${(data.conversions / Math.max(...transactionChartData.map(d => d.conversions))) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                      <div className="mt-2 text-xs text-gray-500 font-medium">{data.name}</div>
                      <div className="text-xs text-gray-400">{data.conversions.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Balances */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Balances</h3>
                <div className="space-y-4">
                  {mockAccountBalances.map((account) => (
                    <div key={account.asset} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <WalletIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">
                              {account.asset} Balance
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {parseFloat(account.balance).toLocaleString(undefined, {
                                minimumFractionDigits: account.asset === 'ETH' ? 4 : 2,
                                maximumFractionDigits: account.asset === 'ETH' ? 6 : 2,
                              })} {account.asset}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            {account.address.slice(0, 12)}...{account.address.slice(-12)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <a 
                          href={account.asset === 'ETH' ? 
                            `https://etherscan.io/address/${account.address}` : 
                            `https://explorer.nyx.net/account/${account.address}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View on {account.asset === 'ETH' ? 'Etherscan' : 'NYM Explorer'} →
                        </a>
                      </div>
                    </div>
                  ))}
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
              {mockTransactions.slice(0, 5).map((transaction) => (
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
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.transactionHash.slice(0, 8)}...{transaction.transactionHash.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          From: {transaction.fromAddress.slice(0, 8)}...{transaction.fromAddress.slice(-8)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-900">
                      <span suppressHydrationWarning>
                        {transaction.createdAt.toLocaleDateString()}
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