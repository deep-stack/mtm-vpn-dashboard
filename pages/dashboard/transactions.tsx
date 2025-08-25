import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { mockTransactions, mockBridgeTransactions, mockSwapTransactions } from '../../data/mockData';
import { Transaction, BridgeTransaction, SwapTransaction } from '../../types';

type TransactionType = 'all' | 'mtm-to-nym' | 'bridge' | 'swap';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionType>('all');

  // Combine all transactions for display
  const allTransactions = [
    ...mockTransactions.map(tx => ({ ...tx, type: 'MTM to NYM' as const })),
    ...mockBridgeTransactions.map(tx => ({ ...tx, type: 'Bridge' as const })),
    ...mockSwapTransactions.map(tx => ({ ...tx, type: 'Swap' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter transactions based on search and type
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesSearch = searchTerm === '' || 
      ('transactionHash' in tx && tx.transactionHash?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ('fromAddress' in tx && tx.fromAddress?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ('ethTransactionHash' in tx && tx.ethTransactionHash?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' ||
      (selectedType === 'mtm-to-nym' && tx.type === 'MTM to NYM') ||
      (selectedType === 'bridge' && tx.type === 'Bridge') ||
      (selectedType === 'swap' && tx.type === 'Swap');
    
    return matchesSearch && matchesType;
  });

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

  const renderTransactionRow = (tx: any, index: number) => {
    return (
      <tr key={`${tx.type}-${tx.id}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {tx.type}
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="space-y-1">
            {/* Main transaction hash */}
            {'transactionHash' in tx && tx.transactionHash && (
              <div className="flex items-center space-x-2">
                <span className="font-mono">
                  {tx.transactionHash.slice(0, 8)}...{tx.transactionHash.slice(-8)}
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
            
            {/* ETH transaction hash */}
            {'ethTransactionHash' in tx && tx.ethTransactionHash && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">ETH:</span>
                <span className="font-mono text-xs">
                  {tx.ethTransactionHash.slice(0, 8)}...{tx.ethTransactionHash.slice(-8)}
                </span>
                <a
                  href={getExplorerUrl(tx.ethTransactionHash, 'ethereum')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
              </div>
            )}
            
            {/* NYM transaction hash */}
            {'nymTransactionHash' in tx && tx.nymTransactionHash && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">NYM:</span>
                <span className="font-mono text-xs">
                  {tx.nymTransactionHash.slice(0, 8)}...{tx.nymTransactionHash.slice(-8)}
                </span>
                <a
                  href={getExplorerUrl(tx.nymTransactionHash, 'nym')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {'fromAddress' in tx && tx.fromAddress && (
            <span className="font-mono">
              {tx.fromAddress.slice(0, 8)}...{tx.fromAddress.slice(-8)}
            </span>
          )}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {('nymAmount' in tx && tx.nymAmount) ? `${tx.nymAmount} NYM` : 
           ('ethAmount' in tx && tx.ethAmount) ? `${tx.ethAmount} ETH` : '-'}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {tx.error ? (
            <div className="max-w-xs truncate text-red-600" title={tx.error}>
              {tx.error}
            </div>
          ) : '-'}
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(tx.createdAt).toLocaleString()}
        </td>
      </tr>
    );
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">All Transactions</h1>
              <p className="mt-2 text-sm text-gray-700">
                View and monitor all MTM to NYM, Bridge, and Swap transactions.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by transaction hash or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as TransactionType)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="mtm-to-nym">MTM to NYM</option>
                <option value="bridge">Bridge</option>
                <option value="swap">Swap</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="mt-6 flex flex-col">
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
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction Hashes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          From Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
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
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx, index) => renderTransactionRow(tx, index))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            No transactions found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Successful Transactions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {allTransactions.filter(tx => !tx.error).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-8 w-8 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Failed Transactions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {allTransactions.filter(tx => tx.error).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">%</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Success Rate
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {allTransactions.length > 0 
                          ? Math.round((allTransactions.filter(tx => !tx.error).length / allTransactions.length) * 100)
                          : 0}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}