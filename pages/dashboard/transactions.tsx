import { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import { mockTransactions, mockBridgeTransactions, mockSwapTransactions } from '../../data/mockData';

export default function Transactions() {
  const [mtmCurrentPage, setMtmCurrentPage] = useState(1);
  const [otherCurrentPage, setOtherCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // MTM to NYM conversions (2-transaction structure: Solana + Nyx)
  const mtmToNymConversions = mockTransactions.map(tx => ({ ...tx, type: 'MTM to NYM' as const }));
  
  // ETH to NYM conversions (each comprising of a Swap and Bridge tx)
  const ethToNymConversions = mockBridgeTransactions.map((bridgeTx, index) => ({
    id: `eth-nym-${bridgeTx.id}`,
    bridgeTransaction: bridgeTx,
    swapTransaction: mockSwapTransactions[index] || null, // Pair with corresponding swap
    createdAt: bridgeTx.createdAt,
    error: bridgeTx.error || (mockSwapTransactions[index]?.error || null),
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


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

  // Pagination logic for MTM conversions
  const mtmTotalPages = Math.ceil(mtmToNymConversions.length / itemsPerPage);
  const mtmStartIndex = (mtmCurrentPage - 1) * itemsPerPage;
  const mtmEndIndex = mtmStartIndex + itemsPerPage;
  const paginatedMtmConversions = mtmToNymConversions.slice(mtmStartIndex, mtmEndIndex);

  // Pagination logic for ETH to NYM conversions
  const ethTotalPages = Math.ceil(ethToNymConversions.length / itemsPerPage);
  const ethStartIndex = (otherCurrentPage - 1) * itemsPerPage;
  const ethEndIndex = ethStartIndex + itemsPerPage;
  const paginatedEthConversions = ethToNymConversions.slice(ethStartIndex, ethEndIndex);

  const renderPagination = (currentPage: number, totalPages: number, setCurrentPage: (page: number) => void) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage)} results
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

  const renderMtmConversionRow = (tx: any, index: number) => {
    return (
      <tr key={`mtm-${tx.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <div className="flex items-center">
            {tx.error ? (
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            ) : (
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            )}
            <span className={tx.error ? 'text-red-600' : 'text-green-600'}>
              {tx.error ? 'Failed' : 'Success'}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-500">
          <div className="space-y-3">
            {/* Solana Transaction */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-medium text-blue-600">Solana Chain:</span>
                {tx.transactionHash && (
                  <a
                    href={getExplorerUrl(tx.transactionHash, 'solana')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="font-mono text-xs text-gray-600">
                {tx.transactionHash ? `${tx.transactionHash.slice(0, 12)}...${tx.transactionHash.slice(-12)}` : 'Pending...'}
              </div>
            </div>
            
            {/* NYM Transaction */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-medium text-purple-600">NYX Chain:</span>
                {tx.nymTransactionHash && (
                  <a
                    href={getExplorerUrl(tx.nymTransactionHash, 'nym')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="font-mono text-xs text-gray-600">
                {tx.nymTransactionHash ? `${tx.nymTransactionHash.slice(0, 12)}...${tx.nymTransactionHash.slice(-12)}` : 'Pending...'}
              </div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {tx.fromAddress && (
            <span className="font-mono">
              {tx.fromAddress.slice(0, 8)}...{tx.fromAddress.slice(-8)}
            </span>
          )}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {tx.error ? (
            <div className="max-w-xs truncate text-red-600" title={tx.error}>
              {tx.error}
            </div>
          ) : '-'}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span suppressHydrationWarning>
            {new Date(tx.createdAt).toLocaleString()}
          </span>
        </td>
      </tr>
    );
  };

  const renderEthConversionRow = (conversion: any, index: number) => {
    const { bridgeTransaction, swapTransaction } = conversion;
    return (
      <tr key={conversion.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          <div className="flex items-center">
            {conversion.error ? (
              <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            ) : (
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            )}
            <span className={conversion.error ? 'text-red-600' : 'text-green-600'}>
              {conversion.error ? 'Failed' : 'Success'}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-500">
          <div className="space-y-3">
            {/* Swap Transaction */}
            {swapTransaction && (
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-orange-600">Swap:</span>
                  {swapTransaction.transactionHash && (
                    <a
                      href={getExplorerUrl(swapTransaction.transactionHash, 'ethereum')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="font-mono text-xs text-gray-600">
                  {swapTransaction.transactionHash ? `${swapTransaction.transactionHash.slice(0, 12)}...${swapTransaction.transactionHash.slice(-12)}` : 'Pending...'}
                </div>
              </div>
            )}
            
            {/* Bridge Transaction */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-medium text-green-600">Bridge:</span>
                {bridgeTransaction.ethTransactionHash && (
                  <a
                    href={getExplorerUrl(bridgeTransaction.ethTransactionHash, 'ethereum')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="font-mono text-xs text-gray-600">
                {bridgeTransaction.ethTransactionHash ? `${bridgeTransaction.ethTransactionHash.slice(0, 12)}...${bridgeTransaction.ethTransactionHash.slice(-12)}` : 'Pending...'}
              </div>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-500">
          <div className="space-y-1">
            {swapTransaction && swapTransaction.ethAmount && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">ETH:</span> {swapTransaction.ethAmount}
              </div>
            )}
            {bridgeTransaction.nymAmount && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">NYM:</span> {bridgeTransaction.nymAmount}
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {conversion.error ? (
            <div className="max-w-xs truncate text-red-600" title={conversion.error}>
              {conversion.error}
            </div>
          ) : '-'}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span suppressHydrationWarning>
            {new Date(conversion.createdAt).toLocaleString()}
          </span>
        </td>
      </tr>
    );
  };


  return (
    <Layout>
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Transaction Monitor</h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor MTM to NYM conversions and other blockchain transactions.
            </p>
          </div>
        </div>


        {/* MTM to NYM Conversions Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">MTM to NYM Conversions</h2>
          <p className="text-sm text-gray-600 mb-4">Each conversion consists of two blockchain transactions: Solana (receive MTM) and NYX (send NYM)</p>
          
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction Hashes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          From Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Error
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedMtmConversions.length > 0 ? (
                        paginatedMtmConversions.map((tx, index) => renderMtmConversionRow(tx, index))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            No MTM to NYM conversions found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {renderPagination(mtmCurrentPage, mtmTotalPages, setMtmCurrentPage)}
        </div>

        {/* ETH to NYM Conversions Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">ETH to NYM Conversions</h2>
          <p className="text-sm text-gray-600 mb-4">Each conversion consists of a Swap transaction (ETH to intermediate token) and a Bridge transaction (to NYM)</p>
          
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction Hashes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amounts
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Error
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedEthConversions.length > 0 ? (
                        paginatedEthConversions.map((conversion, index) => renderEthConversionRow(conversion, index))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            No ETH to NYM conversions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {renderPagination(otherCurrentPage, ethTotalPages, setOtherCurrentPage)}
        </div>

      </div>
    </Layout>
  );
}