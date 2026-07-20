import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, CreditCard, Download, 
  Search, Filter, ArrowUpRight, ArrowDownRight,
  MoreVertical, Eye, FileText, CheckCircle, XCircle,
  Clock, RefreshCcw, AlertCircle
} from 'lucide-react';
import Drawer from '../../components/ui/Drawer';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';

// Generate mock transactions — Cash as primary method
const generateTransactions = (count) => {
  const statuses = ['Completed', 'Pending', 'Refunded', 'Failed'];
  const types = ['Payment', 'Payout', 'Refund'];

  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 5000) + 500;
    const type = types[Math.floor(Math.random() * types.length)];
    const fee = type === 'Payment' ? amount * 0.15 : 0;
    return {
      id: `TXN-${90000 + i}`,
      bookingId: `BK-${20000 + Math.floor(Math.random() * 50)}`,
      customer: `Customer ${Math.floor(Math.random() * 100) + 1}`,
      worker: `Worker ${Math.floor(Math.random() * 50) + 1}`,
      amount,
      fee: parseFloat(fee.toFixed(2)),
      net: parseFloat((amount - fee).toFixed(2)),
      method: 'Cash', // Cash is the only supported method
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type,
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    };
  });
};

// Refund requests data
const generateRefunds = (count) => {
  const reasons = ['Worker did not complete the job', 'Incorrect service delivered', 'Worker was late and customer cancelled', 'Duplicate payment', 'Service unsatisfactory'];
  const statuses = ['Pending', 'Pending', 'Approved', 'Rejected'];
  return Array.from({ length: count }, (_, i) => ({
    id: `REF-${5000 + i}`,
    bookingId: `BK-${20000 + Math.floor(Math.random() * 50)}`,
    customer: `Customer ${Math.floor(Math.random() * 100) + 1}`,
    amount: Math.floor(Math.random() * 3000) + 300,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 8000000000).toISOString().split('T')[0],
  }));
};

const mockTransactions = generateTransactions(50);
const mockRefunds = generateRefunds(20);

const STATUS_COLOR = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Failed: 'bg-red-100 text-red-800',
  Refunded: 'bg-gray-100 text-gray-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const Payments = () => {
  const toast = useToast();
  const [transactions] = useState(mockTransactions);
  const [refunds, setRefunds] = useState(mockRefunds);
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const [refundActionModal, setRefundActionModal] = useState({ open: false, type: '', refund: null });
  const [refundNote, setRefundNote] = useState('');

  const txnsPerPage = 10;
  const refundsPerPage = 10;

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.worker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredRefunds = refunds.filter(r =>
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = activeTab === 'transactions'
    ? Math.ceil(filteredTxns.length / txnsPerPage)
    : Math.ceil(filteredRefunds.length / refundsPerPage);

  const paginatedTxns = filteredTxns.slice((currentPage - 1) * txnsPerPage, currentPage * txnsPerPage);
  const paginatedRefunds = filteredRefunds.slice((currentPage - 1) * refundsPerPage, currentPage * refundsPerPage);

  const handleRefundAction = () => {
    const { type, refund } = refundActionModal;
    const newStatus = type === 'approve' ? 'Approved' : 'Rejected';
    setRefunds(prev => prev.map(r => r.id === refund.id ? { ...r, status: newStatus } : r));
    if (type === 'approve') {
      toast.success('Refund Approved', `Refund of ₱${refund.amount.toLocaleString()} for ${refund.customer} approved.`);
    } else {
      toast.warning('Refund Rejected', `Refund request ${refund.id} has been rejected.`);
    }
    setRefundActionModal({ open: false, type: '', refund: null });
    setRefundNote('');
    setActionMenuOpenId(null);
  };

  const openRefundAction = (type, refund) => {
    setRefundActionModal({ open: true, type, refund });
    setActionMenuOpenId(null);
  };

  const stats = [
    { label: 'Total Revenue', value: '₱312,400', trend: '+12.5%', positive: true, color: 'text-success bg-success/10' },
    { label: 'Platform Commission', value: '₱46,860', trend: '+15.2%', positive: true, color: 'text-primary bg-primary/10' },
    { label: 'Pending Refunds', value: `${refunds.filter(r => r.status === 'Pending').length}`, trend: '', positive: false, color: 'text-danger bg-danger/10' },
    { label: 'Refund Amount (Mo.)', value: '₱8,500', trend: '+1.5%', positive: false, color: 'text-warning bg-warning/10' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Financial Overview</h1>
          <p className="text-gray-500 mt-1">Monitor cash payments, worker payouts, and platform commissions</p>
        </div>
        <button onClick={() => toast.info('Exporting...', 'Report generation coming soon.')} className="bg-white border border-border hover:bg-gray-50 text-navy px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center text-sm">
          <Download size={16} className="mr-2" /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-border p-5">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <DollarSign className="h-5 w-5" />
              </div>
              {stat.trend && (
                <span className={`text-xs font-medium flex items-center ${stat.positive ? 'text-success' : 'text-danger'}`}>
                  {stat.trend} {stat.positive ? <ArrowUpRight size={13} className="ml-0.5" /> : <ArrowDownRight size={13} className="ml-0.5" />}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-display font-bold text-navy">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Cash-only banner */}
      <div className="mb-6 rounded-xl border border-dashed border-border bg-gray-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard size={16} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Payment Methods</span>
        </div>
        <p className="text-sm text-gray-500">
          ✅ <strong>Cash</strong> — Currently supported &nbsp;|&nbsp;
          🔜 GCash, Maya, Credit Card — Coming soon
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-0 border-b border-border">
        {[
          ['transactions', 'Transactions'],
          ['refunds', `Refund Requests (${refunds.filter(r => r.status === 'Pending').length})`],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setCurrentPage(1); setSearchTerm(''); }}
            className={`py-2.5 px-5 font-medium text-sm border-b-2 transition-colors ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-tr-xl shadow-sm border-x border-t border-border p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'transactions' ? "Search by ID, customer, or worker..." : "Search refund requests..."}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        {activeTab === 'transactions' && (
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="All">All Types</option>
              <option value="Payment">Payments</option>
              <option value="Payout">Worker Payouts</option>
              <option value="Refund">Refunds</option>
            </select>
          </div>
        )}
      </div>

      {/* TRANSACTIONS TABLE */}
      {activeTab === 'transactions' && (
        <>
          <div className="bg-white shadow-sm border border-border overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {paginatedTxns.length > 0 ? paginatedTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-navy">{txn.id}</div>
                      <div className="text-xs text-gray-500">Booking: {txn.bookingId}</div>
                      <div className="text-xs text-gray-400">{txn.customer} → {txn.worker}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                        txn.type === 'Payment' ? 'bg-primary/10 text-primary border-primary/20' :
                        txn.type === 'Payout' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        'bg-orange-100 text-orange-700 border-orange-200'
                      }`}>
                        {txn.type}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">💵 {txn.method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-bold ${txn.type === 'Refund' ? 'text-danger' : 'text-navy'}`}>
                        ₱{txn.amount.toLocaleString()}
                      </div>
                      {txn.type === 'Payment' && (
                        <div className="text-xs text-gray-500">Fee: ₱{txn.fee.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[txn.status]}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      <button onClick={() => setActionMenuOpenId(actionMenuOpenId === txn.id ? null : txn.id)} className="text-gray-400 hover:text-navy p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                      {actionMenuOpenId === txn.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpenId(null)} />
                          <div className="absolute right-8 top-10 w-48 bg-white rounded-xl shadow-xl border border-border z-20 py-1.5 text-left">
                            <button onClick={() => { setSelectedTxn(txn); setIsDrawerOpen(true); setActionMenuOpenId(null); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Eye size={15} className="mr-2.5 text-gray-400" /> View Details
                            </button>
                            <button onClick={() => { toast.info('Downloading Receipt', `Receipt for ${txn.id} will be available soon.`); setActionMenuOpenId(null); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <FileText size={15} className="mr-2.5 text-gray-400" /> Download Receipt
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No transactions found matching your criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredTxns.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </>
      )}

      {/* REFUNDS TABLE */}
      {activeTab === 'refunds' && (
        <>
          <div className="bg-white shadow-sm border border-border overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Refund ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer & Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {paginatedRefunds.length > 0 ? paginatedRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-navy">{refund.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-navy font-medium">{refund.customer}</div>
                      <div className="text-xs text-gray-500">{refund.bookingId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-danger">₱{refund.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-[200px] truncate" title={refund.reason}>{refund.reason}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[refund.status]}`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{refund.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      {refund.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openRefundAction('approve', refund)}
                            className="flex items-center px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-lg text-xs font-medium hover:bg-success/20 transition-colors"
                          >
                            <CheckCircle size={13} className="mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => openRefundAction('reject', refund)}
                            className="flex items-center px-3 py-1.5 bg-danger/10 text-danger border border-danger/20 rounded-lg text-xs font-medium hover:bg-danger/20 transition-colors"
                          >
                            <XCircle size={13} className="mr-1" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No refund requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredRefunds.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </>
      )}

      {/* Transaction Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Transaction Details">
        {selectedTxn && (
          <div className="space-y-5">
            <div className="text-center py-6 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">{selectedTxn.type}</p>
              <h2 className="text-4xl font-display font-bold text-navy mb-2">₱{selectedTxn.amount.toLocaleString()}</h2>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLOR[selectedTxn.status]}`}>
                {selectedTxn.status}
              </span>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              {[
                { label: 'Transaction ID', value: selectedTxn.id },
                { label: 'Date', value: selectedTxn.date },
                { label: 'Payment Method', value: `💵 ${selectedTxn.method}` },
                { label: 'Related Booking', value: selectedTxn.bookingId },
                { label: 'Customer', value: selectedTxn.customer },
                { label: 'Worker', value: selectedTxn.worker },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-medium text-navy">{value}</span>
                </div>
              ))}
            </div>

            {selectedTxn.type === 'Payment' && (
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fee Breakdown</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="text-navy">₱{selectedTxn.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-600">Platform Commission (15%)</span><span className="text-danger">-₱{selectedTxn.fee.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-border"><span className="text-navy">Net to Worker</span><span className="text-success">₱{selectedTxn.net.toLocaleString()}</span></div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => toast.info('Receipt', `Downloading receipt for ${selectedTxn.id}...`)} className="flex-1 border border-border text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center">
                <FileText size={16} className="mr-2" /> Receipt
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Refund Action Modal */}
      <Modal
        isOpen={refundActionModal.open}
        onClose={() => { setRefundActionModal({ open: false, type: '', refund: null }); setRefundNote(''); }}
        title={refundActionModal.type === 'approve' ? 'Approve Refund' : 'Reject Refund'}
      >
        <div className="pb-2">
          <div className="text-center mb-5">
            {refundActionModal.type === 'approve' ? (
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
            ) : (
              <XCircle className="h-12 w-12 text-danger mx-auto mb-3" />
            )}
            <p className="text-gray-700 text-sm">
              {refundActionModal.type === 'approve' ? (
                <>Approve refund of <strong className="text-navy">₱{refundActionModal.refund?.amount?.toLocaleString()}</strong> for <strong className="text-navy">{refundActionModal.refund?.customer}</strong>?</>
              ) : (
                <>Reject this refund request from <strong className="text-navy">{refundActionModal.refund?.customer}</strong>?</>
              )}
            </p>
            {refundActionModal.refund?.reason && (
              <div className="mt-3 bg-gray-50 border border-border rounded-lg p-3 text-left">
                <p className="text-xs text-gray-500 font-medium mb-1">Customer's Reason:</p>
                <p className="text-sm text-gray-700">{refundActionModal.refund.reason}</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Admin Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={refundNote}
              onChange={(e) => setRefundNote(e.target.value)}
              placeholder="Add a note for this decision..."
              className="w-full border border-border rounded-lg p-3 text-sm focus:ring-primary/20 focus:border-primary focus:outline-none focus:ring-2 min-h-[90px] resize-none"
            />
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => { setRefundActionModal({ open: false, type: '', refund: null }); setRefundNote(''); }} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleRefundAction} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-white ${refundActionModal.type === 'approve' ? 'bg-success hover:bg-green-600' : 'bg-danger hover:bg-red-700'}`}>
              {refundActionModal.type === 'approve' ? 'Approve Refund' : 'Reject Request'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payments;
