import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, MoreVertical, Clock, CheckCircle,
  XCircle, DollarSign, Eye, ThumbsUp, ThumbsDown, User, Calendar
} from 'lucide-react';
import Drawer from '../../components/ui/Drawer';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import { useFakeLoading } from '../../hooks/useFakeLoading';
import { useToast } from '../../context/ToastContext';

const generateRefunds = (count) => {
  const reasons = [
    'Service not completed', 'Worker no-show', 'Quality issue',
    'Wrong service', 'Duplicate charge', 'Customer changed mind', 'Worker cancelled'
  ];

  return Array.from({ length: count }, (_, i) => {
    const amount = Math.floor(Math.random() * 451) + 50;
    const daysAgo = Math.floor(Math.random() * 14);
    const payDaysAgo = daysAgo + Math.floor(Math.random() * 10) + 5;

    return {
      id: `REF-${5001 + i}`,
      bookingId: `BK-${20000 + Math.floor(Math.random() * 50)}`,
      customer: `Customer ${Math.floor(Math.random() * 50) + 1}`,
      worker: `Worker ${Math.floor(Math.random() * 30) + 1}`,
      amount,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      paymentDate: new Date(Date.now() - payDaysAgo * 86400000).toISOString().split('T')[0],
      requestDate: new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0],
      status: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)],
      paymentMethod: 'Cash',
    };
  });
};

const mockRefunds = generateRefunds(30);

const Refunds = () => {
  const [refunds, setRefunds] = useState(mockRefunds);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const dropdownRef = useRef(null);
  const toast = useToast();
  const isLoading = useFakeLoading(600);

  const refundsPerPage = 10;

  const filteredRefunds = refunds.filter(r => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.worker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);
  const paginatedRefunds = filteredRefunds.slice(
    (currentPage - 1) * refundsPerPage,
    currentPage * refundsPerPage
  );

  const pendingCount = refunds.filter(r => r.status === 'Pending').length;
  const approvedCount = refunds.filter(r => r.status === 'Approved').length;
  const rejectedCount = refunds.filter(r => r.status === 'Rejected').length;
  const totalRefunded = refunds
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + r.amount, 0);

  const stats = [
    { label: 'Pending Requests', value: pendingCount, icon: <Clock className="text-yellow-500" />, bg: 'bg-yellow-50' },
    { label: 'Approved', value: approvedCount, icon: <CheckCircle className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'Rejected', value: rejectedCount, icon: <XCircle className="text-red-500" />, bg: 'bg-red-50' },
    { label: 'Total Refunded', value: `$${totalRefunded.toLocaleString()}`, icon: <DollarSign className="text-blue-500" />, bg: 'bg-blue-50' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <Badge variant="warning">{status}</Badge>;
      case 'Approved': return <Badge variant="success">{status}</Badge>;
      case 'Rejected': return <Badge variant="danger">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const toggleActionMenu = (id) => {
    setActionMenuOpenId(actionMenuOpenId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActionMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewDetails = (refund) => {
    setSelectedRefund(refund);
    setIsDrawerOpen(true);
    setActionMenuOpenId(null);
  };

  const handleApprove = (refund) => {
    setConfirmAction({ type: 'approve', refund });
    setActionMenuOpenId(null);
  };

  const handleReject = (refund) => {
    setConfirmAction({ type: 'reject', refund });
    setActionMenuOpenId(null);
  };

  const confirmApprove = () => {
    setRefunds(prev =>
      prev.map(r => r.id === confirmAction.refund.id ? { ...r, status: 'Approved' } : r)
    );
    if (selectedRefund?.id === confirmAction.refund.id) {
      setSelectedRefund(prev => ({ ...prev, status: 'Approved' }));
    }
    toast.success('Refund Approved', `Refund ${confirmAction.refund.id} has been approved.`);
    setConfirmAction(null);
  };

  const confirmReject = () => {
    setRefunds(prev =>
      prev.map(r => r.id === confirmAction.refund.id ? { ...r, status: 'Rejected' } : r)
    );
    if (selectedRefund?.id === confirmAction.refund.id) {
      setSelectedRefund(prev => ({ ...prev, status: 'Rejected' }));
    }
    toast.success('Refund Rejected', `Refund ${confirmAction.refund.id} has been rejected.`);
    setConfirmAction(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="ml-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-t-xl shadow-sm border-x border-t border-gray-100 p-4 mb-0">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(8)].map((_, i) => (
                  <th key={i} className="px-6 py-3"><Skeleton className="h-4 w-full" /></th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(8)].map((_, j) => (
                    <td key={j} className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Refund Management</h1>
          <p className="text-gray-500 mt-1">Review and process customer refund requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className={`p-4 rounded-lg ${stat.bg} mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-t-xl shadow-sm border-x border-t border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, customer, or worker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Ref</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer & Worker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRefunds.length > 0 ? paginatedRefunds.map((refund) => (
              <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{refund.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-600 font-medium">{refund.bookingId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <User size={14} className="mr-1 text-gray-400" /> {refund.customer}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">Worker: {refund.worker}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${refund.amount.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{refund.paymentMethod}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 max-w-[180px] truncate" title={refund.reason}>{refund.reason}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar size={14} className="mr-1" /> {refund.requestDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(refund.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative" ref={actionMenuOpenId === refund.id ? dropdownRef : undefined}>
                  <button
                    onClick={() => toggleActionMenu(refund.id)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {actionMenuOpenId === refund.id && (
                    <div className="absolute right-8 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
                      <button onClick={() => handleViewDetails(refund)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                        <Eye size={16} className="mr-2 text-gray-400" /> View Details
                      </button>
                      {refund.status === 'Pending' && (
                        <>
                          <button onClick={() => handleApprove(refund)} className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50 text-left">
                            <ThumbsUp size={16} className="mr-2 text-green-500" /> Approve Refund
                          </button>
                          <button onClick={() => handleReject(refund)} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                            <ThumbsDown size={16} className="mr-2 text-red-500" /> Reject Refund
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No refund requests found</h3>
                    <p className="text-gray-500 mt-1">Adjust your search to find what you're looking for.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredRefunds.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Refund ${selectedRefund?.id}`}
        width="w-[500px]"
      >
        {selectedRefund && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">${selectedRefund.amount.toFixed(2)}</h3>
                  <p className="text-sm text-gray-500 mt-1">Refund Amount</p>
                </div>
                {getStatusBadge(selectedRefund.status)}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Refund Information</h4>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Refund ID</span>
                  <span className="font-medium text-gray-900 text-sm">{selectedRefund.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Booking Reference</span>
                  <span className="font-medium text-blue-600 text-sm">{selectedRefund.bookingId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Reason</span>
                  <span className="font-medium text-gray-900 text-sm">{selectedRefund.reason}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Payment Method</span>
                  <span className="font-medium text-gray-900 text-sm">{selectedRefund.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Payment Date</span>
                  <span className="font-medium text-gray-900 text-sm">{selectedRefund.paymentDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Request Date</span>
                  <span className="font-medium text-gray-900 text-sm">{selectedRefund.requestDate}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">People Involved</h4>
              <div className="flex justify-between gap-4">
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold mr-2">
                      {selectedRefund.customer.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{selectedRefund.customer}</span>
                  </div>
                </div>
                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Worker</p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold mr-2">
                      {selectedRefund.worker.charAt(0)}
                    </div>
                    <span className="font-medium text-sm">{selectedRefund.worker}</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedRefund.status === 'Pending' && (
              <div className="border-t border-gray-200 pt-6 pb-4 flex gap-3">
                <button
                  onClick={() => handleReject(selectedRefund)}
                  className="flex-1 px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Reject Refund
                </button>
                <button
                  onClick={() => handleApprove(selectedRefund)}
                  className="flex-1 px-4 py-2 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  Approve Refund
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmationDialog
        isOpen={confirmAction?.type === 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmApprove}
        title="Approve Refund"
        message={`Approve refund of $${confirmAction?.refund?.amount?.toFixed(2)} for booking ${confirmAction?.refund?.bookingId}?`}
        confirmLabel="Approve Refund"
        variant="success"
      />

      <ConfirmationDialog
        isOpen={confirmAction?.type === 'reject'}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmReject}
        title="Reject Refund"
        message={`Reject refund of $${confirmAction?.refund?.amount?.toFixed(2)} for booking ${confirmAction?.refund?.bookingId}? This cannot be undone.`}
        confirmLabel="Reject Refund"
        variant="danger"
      />
    </div>
  );
};

export default Refunds;
