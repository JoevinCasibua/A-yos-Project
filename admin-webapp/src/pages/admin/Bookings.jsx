import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, Calendar, 
  MapPin, Clock, CheckCircle, 
  XCircle, Truck, PlayCircle, Eye, User,
  AlertCircle, RefreshCcw, DollarSign, MessageSquare
} from 'lucide-react';
import Drawer from '../../components/ui/Drawer';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';

const generateBookings = (count) => {
  const statuses = ['Pending', 'Accepted', 'Preparing', 'En Route', 'In Progress', 'Completed', 'Cancelled'];
  const services = ['Plumbing Repair', 'Deep Cleaning', 'Electrical Wiring', 'AC Installation', 'Pest Control', 'Carpentry', 'Painting'];
  const categories = ['Plumbing', 'Cleaning', 'Electrical', 'AC Repair', 'Pest Control', 'Carpentry', 'Painting'];

  return Array.from({ length: count }, (_, i) => {
    const serviceIdx = Math.floor(Math.random() * services.length);
    return {
      id: `BK-${20000 + i}`,
      customer: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      worker: Math.random() > 0.15 ? `Worker ${Math.floor(Math.random() * 50) + 1}` : 'Unassigned',
      service: services[serviceIdx],
      category: categories[serviceIdx],
      address: `${Math.floor(Math.random() * 999) + 1} Rizal St, ${['Manila', 'Quezon City', 'Makati', 'Cebu', 'Davao'][Math.floor(Math.random() * 5)]}`,
      date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
      schedule: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'][Math.floor(Math.random() * 4)],
      duration: `${Math.floor(Math.random() * 4) + 1} hrs`,
      price: Math.floor(Math.random() * 3000) + 500,
      payment: 'Cash',
      paymentStatus: Math.random() > 0.5 ? 'Confirmed' : 'Pending',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: Math.random() > 0.6 ? 'Customer requests worker to arrive early. Gate code: 1234.' : '',
    };
  });
};

const mockBookings = generateBookings(50);

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Accepted: 'bg-blue-100 text-blue-800',
  Preparing: 'bg-purple-100 text-purple-800',
  'En Route': 'bg-indigo-100 text-indigo-800',
  'In Progress': 'bg-cyan-100 text-cyan-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const TIMELINE_STEPS = [
  { label: 'Booking Requested', statuses: [] },
  { label: 'Payment Authorized', statuses: [] },
  { label: 'Worker Accepted', statuses: ['Pending'] },
  { label: 'Preparing / Packing', statuses: ['Pending', 'Accepted'] },
  { label: 'Worker En Route', statuses: ['Pending', 'Accepted', 'Preparing'] },
  { label: 'Job In Progress', statuses: ['Pending', 'Accepted', 'Preparing', 'En Route'] },
  { label: 'Job Completed', statuses: ['Pending', 'Accepted', 'Preparing', 'En Route', 'In Progress'] },
];

const Bookings = () => {
  const toast = useToast();
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null });
  const [cancelReason, setCancelReason] = useState('');
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  const bookingsPerPage = 10;

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage);

  const stats = [
    { label: "Today's Bookings", value: 24, color: 'text-primary bg-primary/10' },
    { label: 'Pending / Unassigned', value: bookings.filter(b => b.status === 'Pending').length, color: 'text-warning bg-warning/10' },
    { label: 'In Progress', value: bookings.filter(b => b.status === 'In Progress').length, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Completed Today', value: 18, color: 'text-success bg-success/10' },
  ];

  const handleCancelConfirm = () => {
    const { booking } = cancelModal;
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'Cancelled' } : b));
    toast.warning('Booking Cancelled', `${booking.id} has been cancelled.`);
    setCancelModal({ open: false, booking: null });
    setCancelReason('');
    setIsDrawerOpen(false);
    setActionMenuOpenId(null);
  };

  const handleResolveIssue = (booking) => {
    toast.success('Issue Resolved', `Booking ${booking.id} marked as resolved.`);
    setActionMenuOpenId(null);
  };

  const isCompletedOrCancelled = (status) => ['Completed', 'Cancelled'].includes(status);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Bookings Management</h1>
          <p className="text-gray-500 mt-1">Track and manage all service bookings across the platform</p>
        </div>
        <button onClick={() => toast.info('Coming Soon', 'Manual booking creation will be available soon.')} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
          + Create Booking
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-border p-5 flex items-center">
            <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-display font-bold text-navy">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-t-xl shadow-sm border-x border-t border-border p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, customer, or service..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Preparing">Preparing</option>
            <option value="En Route">En Route</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <span className="text-sm text-gray-500 ml-2 font-medium">{filteredBookings.length} bookings</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-border overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID & Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Details</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer & Worker</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {paginatedBookings.length > 0 ? paginatedBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-navy">{booking.id}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center"><Calendar size={11} className="mr-1" /> {booking.date}</div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center"><Clock size={11} className="mr-1" /> {booking.schedule} ({booking.duration})</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-navy">{booking.service}</div>
                  <div className="text-xs text-gray-500">{booking.category}</div>
                  <div className="text-xs text-gray-400 mt-1 truncate max-w-[150px]" title={booking.address}>
                    <MapPin size={11} className="inline mr-1" /> {booking.address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-navy flex items-center"><User size={13} className="mr-1.5 text-gray-400" /> {booking.customer}</div>
                  <div className={`text-xs mt-1 font-medium ${booking.worker === 'Unassigned' ? 'text-danger' : 'text-primary'}`}>
                    Worker: {booking.worker}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-navy">₱{booking.price.toLocaleString()}</div>
                  <div className={`text-xs font-medium ${booking.paymentStatus === 'Confirmed' ? 'text-success' : 'text-warning'}`}>
                    {booking.payment} · {booking.paymentStatus}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button onClick={() => setActionMenuOpenId(actionMenuOpenId === booking.id ? null : booking.id)} className="text-gray-400 hover:text-navy p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                  {actionMenuOpenId === booking.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpenId(null)} />
                      <div className="absolute right-8 top-10 w-52 bg-white rounded-xl shadow-xl border border-border z-20 py-1.5 text-left">
                        <button onClick={() => { setSelectedBooking(booking); setIsDrawerOpen(true); setActionMenuOpenId(null); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Eye size={15} className="mr-2.5 text-gray-400" /> View Details
                        </button>
                        {!isCompletedOrCancelled(booking.status) && (
                          <>
                            <button onClick={() => { handleResolveIssue(booking); }} className="flex items-center w-full px-4 py-2 text-sm text-warning hover:bg-warning/5">
                              <MessageSquare size={15} className="mr-2.5 text-warning" /> Resolve Issue
                            </button>
                            <div className="border-t border-border my-1" />
                            <button onClick={() => { setCancelModal({ open: true, booking }); setActionMenuOpenId(null); }} className="flex items-center w-full px-4 py-2 text-sm text-danger hover:bg-danger/5">
                              <XCircle size={15} className="mr-2.5 text-danger" /> Cancel Booking
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <Calendar size={48} className="text-gray-300 mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-navy">No bookings found</h3>
                  <p className="text-gray-500 mt-1">Adjust your search or filter to find what you're looking for.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredBookings.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {/* Booking Details Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={`Booking ${selectedBooking?.id}`}>
        {selectedBooking && (
          <div className="space-y-5">
            {/* Summary card */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base font-bold text-navy">{selectedBooking.service}</h3>
                  <p className="text-sm text-gray-500">{selectedBooking.category}</p>
                </div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedBooking.status]}`}>
                  {selectedBooking.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Date & Time</p>
                  <p className="font-medium text-navy">{selectedBooking.date} · {selectedBooking.schedule}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total Price</p>
                  <p className="font-bold text-navy">₱{selectedBooking.price.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs">Service Address</p>
                  <p className="font-medium text-navy">{selectedBooking.address}</p>
                </div>
                {selectedBooking.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Customer Notes</p>
                    <p className="text-sm text-navy italic">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Information</p>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-success mr-2" />
                  <div>
                    <p className="text-sm font-medium text-navy">{selectedBooking.payment} Payment</p>
                    <p className="text-xs text-gray-500">₱{selectedBooking.price.toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${selectedBooking.paymentStatus === 'Confirmed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {selectedBooking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Parties */}
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">People Involved</p>
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 border border-border rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">Customer</p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-2">
                      {selectedBooking.customer.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-sm text-navy">{selectedBooking.customer}</span>
                      <p className="text-xs text-gray-400">{selectedBooking.customerEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 border border-border rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-2">Assigned Worker</p>
                  {selectedBooking.worker !== 'Unassigned' ? (
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center text-xs font-bold mr-2">
                        {selectedBooking.worker.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-navy">{selectedBooking.worker}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-danger font-medium">Not Assigned</span>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="border-t border-border pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Booking Timeline</p>
              <div className="relative border-l border-border ml-3 space-y-6 pb-4">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isPast = !step.statuses.includes(selectedBooking.status);
                  const isLast = idx === TIMELINE_STEPS.length - 1;
                  const isCompleted = selectedBooking.status === 'Completed' && isLast;
                  const isCancelled = selectedBooking.status === 'Cancelled';
                  const dotColor = isCancelled ? 'bg-danger' : (isPast && !isLast) || isCompleted ? 'bg-success' : isPast ? 'bg-gray-300' : 'bg-gray-200';
                  return (
                    <div key={step.label} className={`relative pl-6 ${step.statuses.includes(selectedBooking.status) && !isCancelled ? 'opacity-40' : ''}`}>
                      <span className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${dotColor}`}></span>
                      <p className="text-sm font-medium text-navy">{step.label}</p>
                    </div>
                  );
                })}
                {selectedBooking.status === 'Cancelled' && (
                  <div className="relative pl-6">
                    <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white bg-danger"></span>
                    <p className="text-sm font-medium text-danger">Booking Cancelled</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            {!isCompletedOrCancelled(selectedBooking.status) && (
              <div className="flex gap-3 pt-2 border-t border-border">
                <button
                  onClick={() => { setCancelModal({ open: true, booking: selectedBooking }); setIsDrawerOpen(false); }}
                  className="flex-1 px-4 py-2.5 border border-danger/30 text-danger rounded-lg text-sm font-medium hover:bg-danger/5 transition-colors"
                >
                  Cancel Booking
                </button>
                <button
                  onClick={() => toast.success('Worker Assigned', 'Worker assignment coming soon.')}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Assign Worker
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={cancelModal.open} onClose={() => { setCancelModal({ open: false, booking: null }); setCancelReason(''); }} title="Cancel Booking">
        <div className="pb-2">
          <div className="text-center mb-4">
            <XCircle className="h-12 w-12 text-danger mx-auto mb-3" />
            <p className="text-gray-600 text-sm">
              You are about to cancel booking <strong className="text-navy">{cancelModal.booking?.id}</strong> for{' '}
              <strong className="text-navy">{cancelModal.booking?.customer}</strong>.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Customer requested cancellation, Worker unavailable..."
              className="w-full border border-border rounded-lg p-3 text-sm focus:ring-primary/20 focus:border-primary focus:outline-none focus:ring-2 min-h-[90px] resize-none"
            />
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => { setCancelModal({ open: false, booking: null }); setCancelReason(''); }} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Keep Booking
            </button>
            <button onClick={handleCancelConfirm} className="flex-1 px-4 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Yes, Cancel Booking
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bookings;
