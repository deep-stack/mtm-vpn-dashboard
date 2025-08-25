// Charts removed for compatibility
import { 
  ArrowsRightLeftIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CurrencyDollarIcon,
  UsersIcon,
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { mockDashboardStats, mockTransactions, mockAppDownloads } from '../../data/mockData';

const stats = [
  {
    id: 1,
    name: 'Total Transactions',
    stat: mockDashboardStats.totalTransactions.toLocaleString(),
    icon: ArrowsRightLeftIcon,
    change: '+4.5%',
    changeType: 'increase',
  },
  {
    id: 2,
    name: 'Successful',
    stat: mockDashboardStats.successfulTransactions.toLocaleString(),
    icon: CheckCircleIcon,
    change: '+2.1%',
    changeType: 'increase',
  },
  {
    id: 3,
    name: 'Failed',
    stat: mockDashboardStats.failedTransactions.toLocaleString(),
    icon: XCircleIcon,
    change: '-8.3%',
    changeType: 'decrease',
  },
  {
    id: 4,
    name: 'Total Volume',
    stat: `$${mockDashboardStats.totalVolume}`,
    icon: CurrencyDollarIcon,
    change: '+12.2%',
    changeType: 'increase',
  },
  {
    id: 5,
    name: 'Active Users',
    stat: mockDashboardStats.activeUsers.toLocaleString(),
    icon: UsersIcon,
    change: '+7.8%',
    changeType: 'increase',
  },
  {
    id: 6,
    name: 'Total Downloads',
    stat: mockDashboardStats.totalDownloads.toLocaleString(),
    icon: CloudArrowDownIcon,
    change: '+15.1%',
    changeType: 'increase',
  },
];

// Generate mock chart data
const transactionChartData = [
  { name: 'Jan', transactions: 850, volume: 125000 },
  { name: 'Feb', transactions: 920, volume: 142000 },
  { name: 'Mar', transactions: 1150, volume: 189000 },
  { name: 'Apr', transactions: 980, volume: 156000 },
  { name: 'May', transactions: 1200, volume: 198000 },
  { name: 'Jun', transactions: 1350, volume: 223000 },
  { name: 'Jul', transactions: 1180, volume: 201000 },
  { name: 'Aug', transactions: mockDashboardStats.totalTransactions, volume: 245000 },
];

const downloadChartData = mockAppDownloads.map(download => ({
  version: download.version,
  downloads: download.downloads,
  platform: download.platform,
}));

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Layout>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard Overview</h1>
          
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
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
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.changeType === 'increase' ? (
                      <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" />
                    )}
                    <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                    {item.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Transaction Volume Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Volume Trend</h3>
                <div className="h-80 flex items-end justify-between space-x-2 border-b border-l border-gray-200 p-4">
                  {transactionChartData.map((data, index) => (
                    <div key={data.name} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all duration-500"
                        style={{ 
                          height: `${(data.transactions / Math.max(...transactionChartData.map(d => d.transactions))) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                      <div className="mt-2 text-xs text-gray-500 font-medium">{data.name}</div>
                      <div className="text-xs text-gray-400">{data.transactions.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* App Downloads Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">App Downloads by Version</h3>
                <div className="h-80 flex items-end justify-between space-x-2 border-b border-l border-gray-200 p-4">
                  {downloadChartData.map((data, index) => (
                    <div key={data.version} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t transition-all duration-500"
                        style={{ 
                          height: `${(data.downloads / Math.max(...downloadChartData.map(d => d.downloads))) * 100}%`,
                          minHeight: '4px'
                        }}
                      />
                      <div className="mt-2 text-xs text-gray-500 font-medium transform -rotate-45 origin-center whitespace-nowrap">
                        {data.version.replace('mtm-vpn-android-', '')}
                      </div>
                      <div className="text-xs text-gray-400 mt-4">{data.downloads}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
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
                      {transaction.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}