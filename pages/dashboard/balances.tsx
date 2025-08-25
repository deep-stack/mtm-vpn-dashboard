import { useState } from 'react';
import { 
  WalletIcon, 
  ArrowPathIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { mockAccountBalances } from '../../data/mockData';

export default function AccountBalances() {
  const [isRefilling, setIsRefilling] = useState(false);
  const [refillAmount, setRefillAmount] = useState('');
  const [refillSuccess, setRefillSuccess] = useState(false);

  const handleRefill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!refillAmount || parseFloat(refillAmount) <= 0) {
      alert('Please enter a valid refill amount');
      return;
    }

    setIsRefilling(true);
    
    // Simulate refill operation
    setTimeout(() => {
      setIsRefilling(false);
      setRefillSuccess(true);
      setRefillAmount('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setRefillSuccess(false);
      }, 3000);
    }, 2000);
  };

  const getBalanceStatus = (asset: string, balance: string) => {
    const balanceNum = parseFloat(balance);
    
    if (asset === 'ETH') {
      if (balanceNum < 0.1) return { status: 'critical', message: 'Critical - Refill needed immediately' };
      if (balanceNum < 0.5) return { status: 'warning', message: 'Low - Consider refilling soon' };
      return { status: 'healthy', message: 'Healthy balance' };
    }
    
    if (asset === 'NYM') {
      if (balanceNum < 1000) return { status: 'critical', message: 'Critical - Refill needed immediately' };
      if (balanceNum < 5000) return { status: 'warning', message: 'Low - Consider refilling soon' };
      return { status: 'healthy', message: 'Healthy balance' };
    }
    
    return { status: 'healthy', message: 'Healthy balance' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'healthy':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return ExclamationTriangleIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'healthy':
        return CheckCircleIcon;
      default:
        return CheckCircleIcon;
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Account Balances</h1>
              <p className="mt-2 text-sm text-gray-700">
                Monitor service wallet balances and refill accounts as needed.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => window.location.reload()}
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Success Alert */}
          {refillSuccess && (
            <div className="mt-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    ETH refill transaction initiated successfully!
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    The transaction has been submitted to the network and should be confirmed shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Balance Cards */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {mockAccountBalances.map((account) => {
              const { status, message } = getBalanceStatus(account.asset, account.balance);
              const StatusIcon = getStatusIcon(status);

              return (
                <div key={account.asset} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <WalletIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {account.asset} Balance
                          </dt>
                          <dd className="text-2xl font-bold text-gray-900">
                            {parseFloat(account.balance).toLocaleString(undefined, {
                              minimumFractionDigits: account.asset === 'ETH' ? 4 : 2,
                              maximumFractionDigits: account.asset === 'ETH' ? 6 : 2,
                            })} {account.asset}
                          </dd>
                          <dd className="text-sm text-gray-500 font-mono mt-1">
                            {account.address.slice(0, 12)}...{account.address.slice(-12)}
                          </dd>
                        </dl>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusIcon className={`h-6 w-6 ${status === 'healthy' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`} />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {message}
                      </div>
                    </div>

                    {/* Balance threshold indicator */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Balance Status</span>
                        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            status === 'healthy' ? 'bg-green-500' : 
                            status === 'warning' ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ 
                            width: status === 'healthy' ? '80%' : 
                                   status === 'warning' ? '40%' : '20%' 
                          }}
                        />
                      </div>
                    </div>

                    {/* Transaction History Link */}
                    <div className="mt-4 text-sm">
                      <a 
                        href={account.asset === 'ETH' ? 
                          `https://etherscan.io/address/${account.address}` : 
                          `https://explorer.nyx.net/account/${account.address}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View on {account.asset === 'ETH' ? 'Etherscan' : 'NYM Explorer'} →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ETH Refill Form */}
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Refill ETH Account
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Add ETH to the service wallet to ensure uninterrupted transaction processing.
                  Minimum recommended balance: 0.5 ETH.
                </p>
              </div>
              <form className="mt-5 sm:flex sm:items-center" onSubmit={handleRefill}>
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="refill-amount" className="sr-only">
                    ETH Amount
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="10"
                    name="refill-amount"
                    id="refill-amount"
                    value={refillAmount}
                    onChange={(e) => setRefillAmount(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.0"
                    disabled={isRefilling}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isRefilling || !refillAmount}
                  className={`mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                    isRefilling || !refillAmount
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isRefilling ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                      Add ETH
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-4 text-xs text-gray-500">
                <p><strong>Note:</strong> This will initiate a transfer from the main treasury wallet to the service wallet.</p>
                <p className="mt-1">Current gas fees will be calculated automatically.</p>
              </div>
            </div>
          </div>

          {/* Balance History */}
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Balance Changes
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Track recent deposits, withdrawals, and service usage.
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <PlusIcon className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">ETH Refill</div>
                        <div className="text-sm text-gray-500">Treasury → Service Wallet</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">+0.5 ETH</div>
                      <div className="text-sm text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                </li>
                
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <WalletIcon className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Transaction Fees</div>
                        <div className="text-sm text-gray-500">Bridge transactions (batch of 15)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">-0.045 ETH</div>
                      <div className="text-sm text-gray-500">4 hours ago</div>
                    </div>
                  </div>
                </li>
                
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <ArrowPathIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">NYM Distribution</div>
                        <div className="text-sm text-gray-500">Sent to users (batch of 8)</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">-892.5 NYM</div>
                      <div className="text-sm text-gray-500">6 hours ago</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}