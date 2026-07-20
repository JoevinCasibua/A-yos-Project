import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, CreditCard, Download, 
  Search, Filter, ArrowUpRight, ArrowDownRight,
  MoreVertical, Eye, FileText
} from 'lucide-react';
import Drawer from '../../components/ui/Drawer';
import Pagination from '../../components/ui/Pagination';

// Generate mock transactions
const generateTransactions = (count) => {
  const statuses = ['Completed', 'Pending', 'Refunded', 'Failed'];
  const methods = ['Credit Card', 'Wallet', 'Bank Transfer', 'Apple Pay'];
  const types = ['Payment', 'Payout', 'Refund'];
  
  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 500) + 20;
    const type = types[Math.floor(Math.random() * types.length)];
    const fee = type === 'Payment' ? amount * 0.15 : 0; // 15% platform commission

    return {
      id: `TXN-${90000 + i}`,
      bookingId: `BK-${20000 + Math.floor(Math.random() * 50)}`,
      customer: `Customer ${Math.floor(Math.random() * 100) + 1}`,
      worker: `Worker ${Math.floor(Math.random() * 50) + 1}`,
      amount: amount,
      fee: fee,
      net: amount - fee,
      method: methods[Math.floor(Math.random() * methods.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: type,
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    };
  });
};

const mockTransactions = generateTransactions(50);

const Payments = () => {
  const [transactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  const txnsPerPage = 10;

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.worker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTxns.length / txnsPerPage);
  const paginatedTxns = filteredTxns.slice((currentPage - 1) * txnsPerPage, currentPage * txnsPerPage);

  const futureMethods = ['GCash (Coming Soon)', 'Maya (Coming Soon)', 'Credit Card (Coming Soon)'];

  const stats = [
    { label: 'Total Revenue', value: '$124,500', trend: '+12.5%', icon: <DollarSign className="text-green-500" />, bg: 'bg-green-50', positive: true },
    { label: 'Platform Commission', value: '$18,675', trend: '+15.2%', icon: <TrendingUp className="text-blue-500" />, bg: 'bg-blue-50', positive: true },
    { label: 'Pending Payouts', value: '$4,200', trend: '-2.4%', icon: <CreditCard className="text-yellow-500" />, bg: 'bg-yellow-50', positive: false },
    { label: 'Refunds (This Month)', value: '$850', trend: '+1.5%', icon: <ArrowDownRight className="text-red-500" />, bg: 'bg-red-50', positive: false },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (txn) => {
    setSelectedTxn(txn);
    setIsDrawerOpen(true);
    setActionMenuOpenId(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-gray-500 mt-1">Monitor revenue, worker payouts, and platform commissions</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center">
          <Download size={18} className="mr-2" /> Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-medium flex items-center ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend} {stat.positive ? <ArrowUpRight size={14} className="ml-1" /> : <ArrowDownRight size={14} className="ml-1" />}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Future payment methods:</span>
          {futureMethods.map((method) => (
            <span key={method} className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-500">{method}</span>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">The current platform only supports cash-based settlement, with future methods disabled until rollout.</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-t-xl shadow-sm border-x border-t border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search transactions by ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Payment">Payments</option>
            <option value="Payout">Worker Payouts</option>
            <option value="Refund">Refunds</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type / Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTxns.length > 0 ? paginatedTxns.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{txn.id}</div>
                  <div className="text-xs text-gray-500">Booking: {txn.bookingId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium mb-1 ${
                    txn.type === 'Payment' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    txn.type === 'Payout' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}>
                    {txn.type}
                  </span>
                  <div className="text-xs text-gray-500">{txn.method}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-bold ${txn.type === 'Refund' ? 'text-red-600' : 'text-gray-900'}`}>
                    ${txn.amount.toFixed(2)}
                  </div>
                  {txn.type === 'Payment' && (
                    <div className="text-xs text-gray-500">Fee: ${txn.fee.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(txn.status)}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {txn.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button 
                    onClick={() => setActionMenuOpenId(actionMenuOpenId === txn.id ? null : txn.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {actionMenuOpenId === txn.id && (
                    <div className="absolute right-8 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
                      <button onClick={() => handleViewDetails(txn)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                        <Eye size={16} className="mr-2 text-gray-400" /> View Details
                      </button>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                        <FileText size={16} className="mr-2 text-gray-400" /> Download Receipt
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredTxns.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}

      {/* Transaction Details Drawer */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Transaction Details"
      >
        {selectedTxn && (
          <div className="space-y-6">
            <div className="text-center py-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">{selectedTxn.type}</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">${selectedTxn.amount.toFixed(2)}</h2>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTxn.status)}`}>
                {selectedTxn.status}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-medium text-gray-900">{selectedTxn.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-900">{selectedTxn.method}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Related Booking</span>
                <span className="font-medium text-blue-600 hover:underline cursor-pointer">{selectedTxn.bookingId}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Involved Parties</h4>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Customer (Payer)</p>
                  <p className="font-medium text-gray-900">{selectedTxn.customer}</p>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Worker (Payee)</p>
                  <p className="font-medium text-gray-900">{selectedTxn.worker}</p>
                </div>
              </div>
            </div>

            {selectedTxn.type === 'Payment' && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Fee Breakdown</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${selectedTxn.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Commission (15%)</span>
                    <span className="text-red-600">-${selectedTxn.fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Net to Worker</span>
                    <span className="text-green-600">${selectedTxn.net.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-6 flex gap-3">
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex justify-center items-center">
                <FileText size={18} className="mr-2" /> Receipt
              </button>
              {selectedTxn.status === 'Completed' && selectedTxn.type === 'Payment' && (
                <button className="flex-1 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors">
                  Issue Refund
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Payments;
