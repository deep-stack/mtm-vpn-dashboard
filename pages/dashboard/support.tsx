import { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { mockSupportTickets } from '../../data/mockData';
import { SupportTicket } from '../../types';

export default function Support() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTickets = mockSupportTickets.filter(ticket => 
    filterStatus === 'all' || ticket.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return ExclamationTriangleIcon;
      case 'in-progress':
        return ClockIcon;
      case 'resolved':
      case 'closed':
        return CheckCircleIcon;
      default:
        return ChatBubbleLeftRightIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseMessage.trim() || !selectedTicket) return;

    // In a real app, this would update the ticket with the new response
    alert(`Response sent to ticket ${selectedTicket.id}`);
    setResponseMessage('');
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    // In a real app, this would update the ticket status
    alert(`Ticket ${ticketId} status changed to ${newStatus}`);
  };

  // Calculate stats
  const stats = {
    total: mockSupportTickets.length,
    open: mockSupportTickets.filter(t => t.status === 'open').length,
    inProgress: mockSupportTickets.filter(t => t.status === 'in-progress').length,
    resolved: mockSupportTickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Customer Support</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage customer support tickets and communications.
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Open</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.open}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.inProgress}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.resolved}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Ticket List */}
            <div className="lg:col-span-4">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Support Tickets</h3>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTickets.map((ticket) => {
                      const StatusIcon = getStatusIcon(ticket.status);
                      return (
                        <div
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedTicket?.id === ticket.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <StatusIcon className="h-4 w-4 text-gray-400" />
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                  {ticket.status.replace('-', ' ')}
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                  {ticket.priority}
                                </span>
                              </div>
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {ticket.subject}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {ticket.email}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Detail */}
            <div className="mt-6 lg:mt-0 lg:col-span-8">
              {selectedTicket ? (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedTicket.subject}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ticket ID: {selectedTicket.id} • {selectedTicket.email}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                          {selectedTicket.status.replace('-', ' ')}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority}
                        </span>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status
                      </label>
                      <div className="flex space-x-2">
                        {['open', 'in-progress', 'resolved', 'closed'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(selectedTicket.id, status)}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              selectedTicket.status === status
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {status.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conversation */}
                    <div className="space-y-4 mb-6">
                      {/* Original Message */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <UserCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {selectedTicket.email}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {new Date(selectedTicket.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {selectedTicket.message}
                        </p>
                      </div>

                      {/* Responses */}
                      {selectedTicket.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`rounded-lg p-4 ${
                            response.isAdminResponse ? 'bg-blue-50' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <UserCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {response.isAdminResponse ? 'Admin (You)' : selectedTicket.email}
                            </span>
                            <span className="text-xs text-gray-500 ml-auto">
                              {new Date(response.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {response.message}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Response Form */}
                    <form onSubmit={handleSendResponse}>
                      <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                        Send Response
                      </label>
                      <textarea
                        id="response"
                        rows={4}
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Type your response here..."
                      />
                      <div className="mt-3 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save Draft
                        </button>
                        <button
                          type="submit"
                          disabled={!responseMessage.trim()}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Send Response
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow sm:rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No ticket selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose a ticket from the list to view details and respond.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}