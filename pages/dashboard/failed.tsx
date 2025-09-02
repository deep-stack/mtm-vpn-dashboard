import { useState } from 'react';
import { 
  XCircleIcon, 
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { mockTransactions, mockBridgeTransactions, mockSwapTransactions } from '../../data/mockData';

export default function FailedTransactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get only failed transactions
  const failedTransactions = [
    ...mockTransactions.filter(tx => tx.error).map(tx => ({ ...tx, type: 'MTM to NYM' as const })),
    ...mockBridgeTransactions.filter(tx => tx.error).map(tx => ({ ...tx, type: 'ETH Bridge' as const })),
    ...mockSwapTransactions.filter(tx => tx.error).map(tx => ({ ...tx, type: 'ETH Swap' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination logic
  const totalPages = Math.ceil(failedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = failedTransactions.slice(startIndex, endIndex);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, failedTransactions.length)} of {failedTransactions.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="px-3 py-2 text-sm font-medium text-gray-700">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
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

  return (
    <Layout>
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Failed Transactions</h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor failed transactions.
            </p>
          </div>
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
                        Transaction Link
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Error Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Failed At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((tx, index) => {
                        const txKey = `${tx.type}-${tx.id}`;

                        return (
                          <tr key={txKey} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <div className="flex items-center">
                                <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                                {tx.type}
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {'transactionHash' in tx && tx.transactionHash && (
                                <a
                                  href={getExplorerUrl(tx.transactionHash, 'solana')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  View Transaction
                                  <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                                </a>
                              )}
                              {'ethTransactionHash' in tx && tx.ethTransactionHash && (
                                <a
                                  href={getExplorerUrl(tx.ethTransactionHash, 'ethereum')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  View Transaction
                                  <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                                </a>
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="max-w-xs">
                                <p className="text-red-600 break-words" title={tx.error}>
                                  {tx.error}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span suppressHydrationWarning>
                                {new Date(tx.createdAt).toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
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
          {renderPagination()}
        </div>
      </div>
    </Layout>
  );
}