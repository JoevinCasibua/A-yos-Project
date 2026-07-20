import React, { useState } from 'react';
import { 
  Search, Filter, MoreVertical, CheckCircle, XCircle, 
  Eye, Edit, Trash2, UserCheck, UserX, AlertCircle,
  Briefcase, Star, MapPin, Phone, Mail, Calendar, Clock,
  FileText, Award, Shield, ChevronRight, RotateCcw
} from 'lucide-react';
import Drawer from '../../components/ui/Drawer';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';

// Generate mock workers
const generateWorkers = (count) => {
  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'AC Repair', 'Painting', 'Pest Control'];
  const statuses = ['Active', 'Active', 'Active', 'Suspended', 'Pending'];
  return Array.from({ length: count }, (_, i) => ({
    id: `WK-${1000 + i}`,
    name: `Worker ${i + 1}`,
    email: `worker${i + 1}@example.com`,
    phone: `+63 9${Math.floor(10 + Math.random() * 90)}${Math.floor(1000000 + Math.random() * 9000000)}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: (Math.random() * 2 + 3).toFixed(1),
    jobsCompleted: Math.floor(Math.random() * 500),
    experience: Math.floor(Math.random() * 15 + 1),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    verified: Math.random() > 0.35,
    location: ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Cebu City'][Math.floor(Math.random() * 5)],
    registeredDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    earnings: Math.floor(Math.random() * 150000),
    availability: ['Online', 'Offline', 'Busy'][Math.floor(Math.random() * 3)],
    deleted: false,
    documents: {
      validId: Math.random() > 0.3 ? 'Submitted' : 'Missing',
      certificate: Math.random() > 0.4 ? 'Submitted' : 'Missing',
      backgroundCheck: Math.random() > 0.5 ? 'Submitted' : 'Pending',
    },
    skills: ['Professional', 'Experienced', 'Licensed'].filter(() => Math.random() > 0.4),
  }));
};

const mockWorkers = generateWorkers(50);

const Workers = () => {
  const toast = useToast();
  const [workers, setWorkers] = useState(mockWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('profile'); // 'profile' | 'documents' | 'skills'
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', worker: null });
  const [remarksModal, setRemarksModal] = useState({ open: false, worker: null });
  const [remarks, setRemarks] = useState('');

  const workersPerPage = 10;

  const filteredWorkers = workers.filter(w => {
    if (w.deleted) return false;
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || w.status === filterStatus;
    const matchesTab = activeTab === 'all' || (activeTab === 'review' && !w.verified);
    return matchesSearch && matchesStatus && matchesTab;
  });

  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);
  const paginatedWorkers = filteredWorkers.slice((currentPage - 1) * workersPerPage, currentPage * workersPerPage);

  const pendingCount = workers.filter(w => !w.verified && !w.deleted).length;

  const stats = [
    { label: 'Total Workers', value: workers.filter(w => !w.deleted).length, color: 'text-primary bg-primary/10' },
    { label: 'Active Workers', value: workers.filter(w => w.status === 'Active' && !w.deleted).length, color: 'text-success bg-success/10' },
    { label: 'Pending Verification', value: pendingCount, color: 'text-warning bg-warning/10' },
    { label: 'Suspended', value: workers.filter(w => w.status === 'Suspended' && !w.deleted).length, color: 'text-danger bg-danger/10' },
  ];

  const openConfirm = (type, worker) => {
    setConfirmModal({ open: true, type, worker });
    setActionMenuOpenId(null);
  };

  const handleConfirm = () => {
    const { type, worker } = confirmModal;
    if (type === 'approve') {
      setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, verified: true, status: 'Active' } : w));
      toast.success('Worker Approved', `${worker.name} is now verified and active.`);
    } else if (type === 'reject') {
      setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, verified: false, status: 'Pending' } : w));
      toast.warning('Worker Rejected', `${worker.name}'s application has been rejected.`);
    } else if (type === 'suspend') {
      setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, status: 'Suspended' } : w));
      toast.info('Worker Suspended', `${worker.name} has been suspended.`);
    } else if (type === 'reactivate') {
      setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, status: 'Active' } : w));
      toast.success('Worker Reactivated', `${worker.name} is now active.`);
    } else if (type === 'softdelete') {
      setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, deleted: true } : w));
      toast.info('Worker Deleted', `${worker.name} moved to Trash.`);
    }
    setConfirmModal({ open: false, type: '', worker: null });
    setIsDrawerOpen(false);
  };

  const submitRemarks = () => {
    if (!remarks.trim()) return;
    toast.info('Documents Requested', `Remarks sent to ${remarksModal.worker?.name}.`);
    setRemarksModal({ open: false, worker: null });
    setRemarks('');
  };

  const toggleAvailability = (worker) => {
    const next = worker.availability === 'Online' ? 'Busy' : worker.availability === 'Busy' ? 'Offline' : 'Online';
    setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, availability: next } : w));
    setActionMenuOpenId(null);
    toast.info('Availability Updated', `${worker.name} set to ${next}.`);
  };

  const getAvailabilityColor = (avail) => {
    if (avail === 'Online') return 'bg-success text-white';
    if (avail === 'Busy') return 'bg-warning text-white';
    return 'bg-gray-300 text-gray-800';
  };

  const getConfirmConfig = () => {
    const { type, worker } = confirmModal;
    const configs = {
      approve: { title: 'Approve Worker', icon: <UserCheck className="h-10 w-10 text-success mx-auto mb-3" />, message: `Approve <strong>${worker?.name}</strong> as a verified worker?`, confirmLabel: 'Approve', cls: 'bg-success hover:bg-green-600 text-white' },
      reject: { title: 'Reject Application', icon: <XCircle className="h-10 w-10 text-danger mx-auto mb-3" />, message: `Reject <strong>${worker?.name}</strong>'s worker application?`, confirmLabel: 'Reject', cls: 'bg-danger hover:bg-red-700 text-white' },
      suspend: { title: 'Suspend Worker', icon: <UserX className="h-10 w-10 text-warning mx-auto mb-3" />, message: `Suspend <strong>${worker?.name}</strong>? They won't be able to accept new bookings.`, confirmLabel: 'Suspend', cls: 'bg-warning hover:bg-yellow-600 text-white' },
      reactivate: { title: 'Reactivate Worker', icon: <UserCheck className="h-10 w-10 text-success mx-auto mb-3" />, message: `Reactivate <strong>${worker?.name}</strong>?`, confirmLabel: 'Reactivate', cls: 'bg-success hover:bg-green-600 text-white' },
      softdelete: { title: 'Delete Worker', icon: <Trash2 className="h-10 w-10 text-danger mx-auto mb-3" />, message: `Move <strong>${worker?.name}</strong> to Trash? Restorable within 30 days.`, confirmLabel: 'Move to Trash', cls: 'bg-danger hover:bg-red-700 text-white' },
    };
    return configs[type] || {};
  };

  const cfg = getConfirmConfig();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Workers Management</h1>
          <p className="text-gray-500 mt-1">Manage platform service providers and their verification</p>
        </div>
        <button onClick={() => toast.info('Coming Soon', 'Manual worker creation will be available soon.')} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
          + Add New Worker
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-border p-5 flex items-center">
            <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
              <h3 className="text-2xl font-display font-bold text-navy">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 border-b border-border">
        {[['all', 'All Workers'], ['review', `Review Queue`]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setCurrentPage(1); }}
            className={`py-2.5 px-5 font-medium text-sm border-b-2 flex items-center transition-colors ${
              activeTab === id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {label}
            {id === 'review' && pendingCount > 0 && (
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs font-bold ${activeTab === 'review' ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-700'}`}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-t-xl shadow-sm border-x border-t border-border p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workers by name, ID, or category..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-primary/20 focus:border-primary text-sm focus:outline-none focus:ring-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:ring-primary/20 focus:border-primary focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>
          <span className="text-sm text-gray-500 font-medium ml-2">{filteredWorkers.length} workers</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-border overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {paginatedWorkers.length > 0 ? paginatedWorkers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {worker.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-navy">{worker.name}</div>
                      <div className="text-xs text-gray-500">{worker.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-navy">{worker.category}</div>
                  <div className="text-xs text-gray-500">{worker.experience} yrs exp</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-navy">
                    <Star size={14} className="text-warning mr-1 fill-current" />
                    {worker.rating}
                  </div>
                  <div className="text-xs text-gray-500">{worker.jobsCompleted} jobs</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getAvailabilityColor(worker.availability)}`}>
                    {worker.availability}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {worker.verified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      <CheckCircle size={12} className="mr-1" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                      <AlertCircle size={12} className="mr-1" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    worker.status === 'Active' ? 'bg-success/10 text-success' :
                    worker.status === 'Suspended' ? 'bg-danger/10 text-danger' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {worker.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button onClick={() => setActionMenuOpenId(actionMenuOpenId === worker.id ? null : worker.id)} className="text-gray-400 hover:text-navy p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                  {actionMenuOpenId === worker.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpenId(null)} />
                      <div className="absolute right-8 top-10 w-52 bg-white rounded-xl shadow-xl border border-border z-20 py-1.5 text-left">
                        <button onClick={() => { setSelectedWorker(worker); setDrawerTab('profile'); setIsDrawerOpen(true); setActionMenuOpenId(null); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Eye size={15} className="mr-2.5 text-gray-400" /> View Details
                        </button>
                        {!worker.verified && (
                          <>
                            <div className="border-t border-border my-1" />
                            <button onClick={() => openConfirm('approve', worker)} className="flex items-center w-full px-4 py-2 text-sm text-success hover:bg-success/5">
                              <CheckCircle size={15} className="mr-2.5 text-success" /> Approve Worker
                            </button>
                            <button onClick={() => openConfirm('reject', worker)} className="flex items-center w-full px-4 py-2 text-sm text-danger hover:bg-danger/5">
                              <XCircle size={15} className="mr-2.5 text-danger" /> Reject Application
                            </button>
                            <button onClick={() => { setRemarksModal({ open: true, worker }); setActionMenuOpenId(null); }} className="flex items-center w-full px-4 py-2 text-sm text-warning hover:bg-warning/5">
                              <FileText size={15} className="mr-2.5 text-warning" /> Request Documents
                            </button>
                          </>
                        )}
                        <div className="border-t border-border my-1" />
                        <button onClick={() => toggleAvailability(worker)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Clock size={15} className="mr-2.5 text-gray-400" />
                          Set {worker.availability === 'Online' ? 'Busy' : worker.availability === 'Busy' ? 'Offline' : 'Online'}
                        </button>
                        {worker.status === 'Suspended' ? (
                          <button onClick={() => openConfirm('reactivate', worker)} className="flex items-center w-full px-4 py-2 text-sm text-success hover:bg-success/5">
                            <UserCheck size={15} className="mr-2.5 text-success" /> Reactivate
                          </button>
                        ) : (
                          <button onClick={() => openConfirm('suspend', worker)} className="flex items-center w-full px-4 py-2 text-sm text-warning hover:bg-warning/5">
                            <UserX size={15} className="mr-2.5 text-warning" /> Suspend
                          </button>
                        )}
                        <div className="border-t border-border my-1" />
                        <button onClick={() => openConfirm('softdelete', worker)} className="flex items-center w-full px-4 py-2 text-sm text-danger hover:bg-danger/5">
                          <Trash2 size={15} className="mr-2.5 text-danger" /> Move to Trash
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <UserX size={48} className="text-gray-300 mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-navy">No workers found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredWorkers.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {/* Worker Details Drawer — with tabs */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Worker Details">
        {selectedWorker && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0">
                {selectedWorker.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-navy">{selectedWorker.name}</h3>
                <p className="text-gray-500 text-sm">{selectedWorker.id}</p>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${selectedWorker.status === 'Active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {selectedWorker.status}
                  </span>
                  {selectedWorker.verified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      <CheckCircle size={10} className="mr-1" /> Verified
                    </span>
                  )}
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${getAvailabilityColor(selectedWorker.availability)}`}>
                    {selectedWorker.availability}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {[['profile', 'Profile'], ['documents', 'Documents'], ['skills', 'Skills']].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setDrawerTab(id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${drawerTab === id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-navy'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {drawerTab === 'profile' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600"><Mail size={14} className="mr-3 text-gray-400" /> {selectedWorker.email}</div>
                  <div className="flex items-center text-sm text-gray-600"><Phone size={14} className="mr-3 text-gray-400" /> {selectedWorker.phone}</div>
                  <div className="flex items-center text-sm text-gray-600"><MapPin size={14} className="mr-3 text-gray-400" /> {selectedWorker.location}</div>
                  <div className="flex items-center text-sm text-gray-600"><Calendar size={14} className="mr-3 text-gray-400" /> Registered {selectedWorker.registeredDate}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Category', value: selectedWorker.category },
                    { label: 'Experience', value: `${selectedWorker.experience} Years` },
                    { label: 'Jobs Done', value: selectedWorker.jobsCompleted },
                    { label: 'Rating', value: `⭐ ${selectedWorker.rating}` },
                    { label: 'Earnings', value: `₱${selectedWorker.earnings.toLocaleString()}` },
                    { label: 'Active Bookings', value: Math.floor(Math.random() * 5) },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="font-semibold text-navy text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {drawerTab === 'documents' && (
              <div className="space-y-3">
                {[
                  { label: 'Valid Government ID', key: 'validId', icon: Shield },
                  { label: 'Trade Certificate / License', key: 'certificate', icon: Award },
                  { label: 'Background Check', key: 'backgroundCheck', icon: FileText },
                ].map(({ label, key, icon: Icon }) => {
                  const status = selectedWorker.documents[key];
                  const isSubmitted = status === 'Submitted';
                  return (
                    <div key={key} className={`p-4 rounded-lg border ${isSubmitted ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${isSubmitted ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-navy">{label}</p>
                            <p className={`text-xs font-medium mt-0.5 ${isSubmitted ? 'text-success' : 'text-warning'}`}>
                              {status}
                            </p>
                          </div>
                        </div>
                        {isSubmitted && (
                          <button className="text-xs text-primary hover:underline font-medium flex items-center">
                            View <ChevronRight size={14} className="ml-0.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {!selectedWorker.verified && (
                  <div className="pt-3 flex gap-3">
                    <button onClick={() => { openConfirm('approve', selectedWorker); setIsDrawerOpen(false); }} className="flex-1 bg-success text-white text-sm font-medium py-2.5 rounded-lg hover:bg-green-600 transition-colors">
                      Approve Worker
                    </button>
                    <button onClick={() => { openConfirm('reject', selectedWorker); setIsDrawerOpen(false); }} className="flex-1 bg-danger text-white text-sm font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {drawerTab === 'skills' && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-navy mb-3">Certifications & Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {[selectedWorker.category, ...selectedWorker.skills, 'Professional', 'Bonded'].map((skill) => (
                      <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Service Specialization</p>
                  <p className="font-semibold text-navy">{selectedWorker.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Years of Experience</p>
                  <p className="font-semibold text-navy">{selectedWorker.experience} Years</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-border">
              <button onClick={() => setIsDrawerOpen(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
              <button onClick={() => toast.info('Edit Worker', 'Edit form coming soon.')} className="flex-1 px-4 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors">Edit Profile</button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, type: '', worker: null })} title={cfg.title || ''}>
        <div className="text-center pb-2">
          {cfg.icon}
          <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: cfg.message || '' }} />
          <div className="flex gap-3 mt-6">
            <button onClick={() => setConfirmModal({ open: false, type: '', worker: null })} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleConfirm} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${cfg.cls}`}>{cfg.confirmLabel}</button>
          </div>
        </div>
      </Modal>

      {/* Request Documents Modal */}
      <Modal isOpen={remarksModal.open} onClose={() => setRemarksModal({ open: false, worker: null })} title="Request Additional Documents">
        <div className="pb-2">
          <p className="text-sm text-gray-600 mb-4">
            Provide remarks on what documents <span className="font-semibold text-navy">{remarksModal.worker?.name}</span> needs to submit for verification.
          </p>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Please upload a clearer copy of your Valid ID and trade license..."
            className="w-full border border-border rounded-lg p-3 text-sm focus:ring-primary/20 focus:border-primary focus:outline-none focus:ring-2 min-h-[120px] resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button onClick={() => setRemarksModal({ open: false, worker: null })} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={submitRemarks} disabled={!remarks.trim()} className="flex-1 px-4 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              Send Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Workers;
