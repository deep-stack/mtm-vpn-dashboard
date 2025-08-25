import { useState } from 'react';
import { 
  XCircleIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { mockTransactions, mockBridgeTransactions, mockSwapTransactions } from '../../data/mockData';

export default function FailedTransactions() {
  // Get only failed transactions
  const failedTransactions = [
    ...mockTransactions.filter(tx => tx.error).map(tx => ({ ...tx, type: 'MTM to NYM' as const })),
    ...mockBridgeTransactions.filter(tx => tx.error).map(tx => ({ ...tx, type: 'Bridge' as const })),
    ...mockSwapTransactions.filter(tx => tx.error).map(tx => ({ ...tx, type: 'Swap' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [retryingTx, setRetryingTx] = useState<string | null>(null);

  const handleRetry = async (txId: string | number, type: string) => {
    setRetryingTx(`${type}-${txId}`);
    
    // Simulate retry operation
    setTimeout(() => {
      setRetryingTx(null);
      // In a real app, you would trigger the retry logic here
      alert(`Retry initiated for transaction ${txId} (${type})`);
    }, 2000);
  };

  const getExplorerUrl = (hash: string, type: 'solana' | 'ethereum' | 'nym') => {
    switch (type) {
      case 'solana':
        return `https://explorer.solana.com/tx/${hash}`;
      case 'ethereum':
        return `https://etherscan.io/tx/${hash}`;
      case 'nym':
        return `https://explorer.nyx.net/transactions/${hash}`;
      default:
        return '#';
    }
  };

  const getErrorCategory = (error: string) => {
    if (error.toLowerCase().includes('insufficient')) {
      return { category: 'Insufficient Funds', color: 'bg-red-100 text-red-800', icon: XCircleIcon };
    } else if (error.toLowerCase().includes('network') || error.toLowerCase().includes('timeout')) {
      return { category: 'Network Issue', color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon };
    } else if (error.toLowerCase().includes('slippage') || error.toLowerCase().includes('failed')) {
      return { category: 'Transaction Failed', color: 'bg-orange-100 text-orange-800', icon: XCircleIcon };
    } else {
      return { category: 'Other Error', color: 'bg-gray-100 text-gray-800', icon: ExclamationTriangleIcon };
    }
  };

  const errorCategories = failedTransactions.reduce((acc, tx) => {
    const { category } = getErrorCategory(tx.error || '');
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ProtectedRoute>
      <Layout>
        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Failed Transactions</h1>
              <p className="mt-2 text-sm text-gray-700">
                Monitor and troubleshoot failed transactions across all services.
              </p>
            </div>
          </div>

          {/* Error Categories Summary */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(errorCategories).map(([category, count]) => (
              <div key={category} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <XCircleIcon className="h-8 w-8 text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {category}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {count}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Failed Transactions Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Error Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Error Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Failed At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {failedTransactions.length > 0 ? (
                        failedTransactions.map((tx, index) => {
                          const { category, color, icon: ErrorIcon } = getErrorCategory(tx.error || '');
                          const txKey = `${tx.type}-${tx.id}`;
                          const isRetrying = retryingTx === txKey;

                          return (
                            <tr key={txKey} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <div className="flex items-center">
                                  <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                                  {tx.type}
                                </div>
                              </td>
                              
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="space-y-1">
                                  {/* Main transaction hash */}
                                  {'transactionHash' in tx && tx.transactionHash && (
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono text-xs">
                                        {tx.transactionHash.slice(0, 12)}...
                                      </span>
                                      <a
                                        href={getExplorerUrl(tx.transactionHash, 'solana')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                      >
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                      </a>
                                    </div>
                                  )}
                                  
                                  {/* From address */}
                                  {'fromAddress' in tx && tx.fromAddress && (
                                    <div className="text-xs text-gray-400">
                                      From: {tx.fromAddress.slice(0, 8)}...
                                    </div>
                                  )}
                                  
                                  {/* Amount */}
                                  {(('nymAmount' in tx && tx.nymAmount) || ('ethAmount' in tx && tx.ethAmount)) && (
                                    <div className="text-xs text-gray-400">
                                      Amount: {('nymAmount' in tx && tx.nymAmount) ? `${tx.nymAmount} NYM` : 
                                               ('ethAmount' in tx && tx.ethAmount) ? `${tx.ethAmount} ETH` : ''}
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
                                  {category}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-sm text-gray-500">
                                <div className="max-w-xs">
                                  <p className="text-red-600 break-words" title={tx.error}>
                                    {tx.error}
                                  </p>
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(tx.createdAt).toLocaleString()}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleRetry(tx.id, tx.type)}
                                  disabled={isRetrying}
                                  className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded text-white ${
                                    isRetrying
                                      ? 'bg-gray-400 cursor-not-allowed'
                                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                  }`}
                                >
                                  {isRetrying ? (
                                    <>
                                      <ArrowPathIcon className="animate-spin -ml-1 mr-1 h-4 w-4" />
                                      Retrying...
                                    </>
                                  ) : (
                                    <>
                                      <ArrowPathIcon className="-ml-1 mr-1 h-4 w-4" />
                                      Retry
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                            <div className="flex flex-col items-center">
                              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">No failed transactions</h3>
                              <p className="mt-1 text-sm text-gray-500">
                                All transactions are processing successfully.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Error Analysis */}
          {failedTransactions.length > 0 && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Common Error Patterns
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc space-y-1 pl-5">
                      {Object.entries(errorCategories).map(([category, count]) => (
                        <li key={category}>
                          <strong>{category}:</strong> {count} occurrence{count !== 1 ? 's' : ''}
                          {category === 'Insufficient Funds' && (
                            <span className="ml-2 text-xs">
                              - Consider refilling service wallets
                            </span>
                          )}
                          {category === 'Network Issue' && (
                            <span className="ml-2 text-xs">
                              - May resolve automatically or need retry
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}