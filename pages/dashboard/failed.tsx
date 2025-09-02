import { useState, useEffect } from 'react';

import { 
  XCircleIcon, 
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';

import Layout from '../../components/Layout';
import { dashboardApi, TransactionData, SwapData, ApiError } from '../../utils/api';
import { getExplorerUrl } from '../../utils/explorer';
import { copyToClipboard } from '../../utils/clipboard';

export default function FailedTransactions() {
  // MTM to NYM state
  const [mtmFailures, setMtmFailures] = useState<TransactionData[]>([]);
  const [mtmLoading, setMtmLoading] = useState(true);
  const [mtmError, setMtmError] = useState<string | null>(null);
  const [mtmCurrentPage, setMtmCurrentPage] = useState(1);
  const [mtmTotalPages, setMtmTotalPages] = useState(1);

  // ETH to NYM state
  const [ethFailures, setEthFailures] = useState<SwapData[]>([]);
  const [ethLoading, setEthLoading] = useState(true);
  const [ethError, setEthError] = useState<string | null>(null);
  const [ethCurrentPage, setEthCurrentPage] = useState(1);
  const [ethTotalPages, setEthTotalPages] = useState(1);

  const itemsPerPage = 5;

  // Fetch MTM to NYM failed conversions
  useEffect(() => {
    const fetchMtmFailures = async () => {
      try {
        setMtmLoading(true);
        setMtmError(null);
        const response = await dashboardApi.getConversions({
          page: mtmCurrentPage,
          limit: itemsPerPage,
          status: 'failed'
        });
        setMtmFailures(response.transactions);
        setMtmTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching MTM failures:', error);
        setMtmError(error instanceof ApiError ? error.message : 'Failed to load MTM conversion failures');
      } finally {
        setMtmLoading(false);
      }
    };

    fetchMtmFailures();
  }, [mtmCurrentPage]);

  // Fetch ETH to NYM failed swaps/bridges
  useEffect(() => {
    const fetchEthFailures = async () => {
      try {
        setEthLoading(true);
        setEthError(null);
        const response = await dashboardApi.getSwaps({
          page: ethCurrentPage,
          limit: itemsPerPage,
          status: 'failed'
        });
        setEthFailures(response.swaps);
        setEthTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching ETH failures:', error);
        setEthError(error instanceof ApiError ? error.message : 'Failed to load ETH conversion failures');
      } finally {
        setEthLoading(false);
      }
    };

    fetchEthFailures();
  }, [ethCurrentPage]);

  const renderPagination = (currentPage: number, totalPages: number, onPageChange: (page: number) => void) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="px-3 py-2 text-sm font-medium text-gray-700">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderLoadingState = () => (
    <tr>
      <td colSpan={4} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading failed transactions...</p>
        </div>
      </td>
    </tr>
  );

  const renderErrorState = (error: string) => (
    <tr>
      <td colSpan={4} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
        <div className="flex flex-col items-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Data</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </td>
    </tr>
  );

  const renderEmptyState = (message: string) => (
    <tr>
      <td colSpan={4} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
        <div className="flex flex-col items-center">
          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Failed Transactions</h3>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </td>
    </tr>
  );


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

        {/* MTM to NYM Conversion Failures */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">MTM to NYM Conversion Failures</h2>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction Link
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          From Address
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
                      {mtmLoading ? (
                        renderLoadingState()
                      ) : mtmError ? (
                        renderErrorState(mtmError)
                      ) : mtmFailures.length > 0 ? (
                        mtmFailures.map((tx, index) => (
                          <tr key={tx.id} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <a
                                href={getExplorerUrl(tx.transactionHash, 'solana')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                View Solana TX
                                <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="font-mono text-xs">{tx.fromAddress}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="max-w-xs flex items-start space-x-2">
                                <p className="text-red-600 break-words truncate flex-1" title={tx.error || 'Unknown error'}>
                                  {tx.error && tx.error.length > 80 ? `${tx.error.substring(0, 80)}...` : (tx.error || 'Unknown error')}
                                </p>
                                {tx.error && (
                                  <button
                                    onClick={() => copyToClipboard(tx.error!, 'MTM conversion error')}
                                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                    title="Copy full error message"
                                  >
                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span suppressHydrationWarning>
                                {new Date(tx.createdAt).toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        renderEmptyState('All MTM to NYM conversions have been processed successfully.')
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {renderPagination(mtmCurrentPage, mtmTotalPages, setMtmCurrentPage)}
          </div>
        </div>

        {/* ETH to NYM Conversion Failures */}
        <div className="mt-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">ETH to NYM Conversion Failures</h2>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ETH Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Swap Transaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bridge Transaction
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
                      {ethLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                            <div className="flex flex-col items-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              <p className="mt-2">Loading failed transactions...</p>
                            </div>
                          </td>
                        </tr>
                      ) : ethError ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                            <div className="flex flex-col items-center">
                              <ExclamationTriangleIcon className="h-12 w-12 text-red-400" />
                              <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Data</h3>
                              <p className="mt-1 text-sm text-red-600">{ethError}</p>
                            </div>
                          </td>
                        </tr>
                      ) : ethFailures.length > 0 ? (
                        ethFailures.map((swap, index) => (
                          <tr key={swap.id} className={index % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {parseFloat(swap.ethAmount).toFixed(4)} ETH
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {swap.transactionHash ? (
                                <a
                                  href={getExplorerUrl(swap.transactionHash, 'ethereum')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  View Swap TX
                                  <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                                </a>
                              ) : (
                                <span className="text-gray-400">No transaction</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {swap.bridgeTransaction?.ethTransactionHash ? (
                                <a
                                  href={getExplorerUrl(swap.bridgeTransaction.ethTransactionHash, 'ethereum')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  View Bridge TX
                                  <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                                </a>
                              ) : (
                                <span className="text-gray-400">No bridge transaction</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="max-w-xs space-y-1">
                                {swap.error && (
                                  <div className="flex items-start space-x-2">
                                    <p className="text-red-600 break-words truncate flex-1" title={`Swap Error: ${swap.error}`}>
                                      <span className="font-medium">Swap:</span> {swap.error.length > 50 ? `${swap.error.substring(0, 50)}...` : swap.error}
                                    </p>
                                    <button
                                      onClick={() => copyToClipboard(swap.error!, 'Swap error')}
                                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                      title="Copy full swap error message"
                                    >
                                      <ClipboardDocumentIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                                {swap.bridgeTransaction?.error && (
                                  <div className="flex items-start space-x-2">
                                    <p className="text-red-600 break-words truncate flex-1" title={`Bridge Error: ${swap.bridgeTransaction.error}`}>
                                      <span className="font-medium">Bridge:</span> {swap.bridgeTransaction.error.length > 50 ? `${swap.bridgeTransaction.error.substring(0, 50)}...` : swap.bridgeTransaction.error}
                                    </p>
                                    <button
                                      onClick={() => copyToClipboard(swap.bridgeTransaction!.error!, 'Bridge error')}
                                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                      title="Copy full bridge error message"
                                    >
                                      <ClipboardDocumentIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span suppressHydrationWarning>
                                {new Date(swap.createdAt).toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center">
                            <div className="flex flex-col items-center">
                              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">No Failed Transactions</h3>
                              <p className="mt-1 text-sm text-gray-500">
                                All ETH to NYM conversions have been processed successfully.
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
            {renderPagination(ethCurrentPage, ethTotalPages, setEthCurrentPage)}
          </div>
        </div>
      </div>
    </Layout>
  );
}