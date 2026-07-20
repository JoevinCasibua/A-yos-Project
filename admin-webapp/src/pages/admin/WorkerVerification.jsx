import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, MoreVertical, AlertCircle, CheckCircle, XCircle,
  AlertTriangle, Eye, UserCheck, UserX, FileText, Mail, Phone,
  Calendar, Clock, Upload
} from 'lucide-react';
import Drawer from '../../components/ui/Drawer';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import { useFakeLoading } from '../../hooks/useFakeLoading';
import { useToast } from '../../context/ToastContext';

const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'AC Repair'];
const skillOptions = ['Licensed', 'Insured', 'Background Check', 'First Aid', 'Certified', 'Senior', 'Junior'];
const docTemplates = [
  { name: 'Valid ID - Philippine National ID', type: 'Government ID' },
  { name: 'Certificate of Completion', type: 'Training' },
  { name: 'Police Clearance', type: 'Clearance' },
  { name: 'Barangay Clearance', type: 'Clearance' },
  { name: 'NBI Clearance', type: 'Clearance' },
  { name: 'Professional License', type: 'License' },
];

const pickRandom = (arr, min = 1, max = 1) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const generateWorkers = () => {
  const statuses = ['Pending', 'Approved', 'Rejected', 'NeedsInfo'];
  return Array.from({ length: 20 }, (_, i) => {
    const daysAgo = Math.floor(Math.random() * 30);
    const appliedDate = new Date(Date.now() - daysAgo * 86400000);
    return {
      id: `WV-${1001 + i}`,
      name: `Worker ${i + 1}`,
      email: `worker${i + 1}@example.com`,
      phone: `+63 9${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
      appliedDate: appliedDate.toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      experience: Math.floor(Math.random() * 15) + 1,
      skills: pickRandom(skillOptions, 2, 4),
      bio: [
        'Experienced professional with a strong track record in the field.',
        'Dedicated to providing high-quality service to all clients.',
        'Reliable and skilled worker committed to excellence.',
        'Licensed professional with years of hands-on experience.',
        'Customer-focused service provider with great attention to detail.',
      ][Math.floor(Math.random() * 5)],
      documents: pickRandom(docTemplates, 2, 4),
    };
  });
};

const initialWorkers = generateWorkers();

const WorkerVerification = () => {
  const toast = useToast();
  const isLoading = useFakeLoading(600);

  const [workers, setWorkers] = useState(initialWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const actionMenuRef = useRef(null);

  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [requestDocsTarget, setRequestDocsTarget] = useState(null);
  const [requestDocsRemarks, setRequestDocsRemarks] = useState('');

  const rowsPerPage = 10;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredWorkers = workers.filter((w) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = w.name.toLowerCase().includes(q) || w.id.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'All' || w.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredWorkers.length / rowsPerPage);
  const paginatedWorkers = filteredWorkers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const stats = [
    {
      label: 'Pending Review',
      value: workers.filter((w) => w.status === 'Pending').length,
      icon: <AlertCircle size={22} className="text-yellow-600" />,
      bg: 'bg-yellow-50',
    },
    {
      label: 'Approved Today',
      value: workers.filter((w) => w.status === 'Approved').length,
      icon: <CheckCircle size={22} className="text-green-600" />,
      bg: 'bg-green-50',
    },
    {
      label: 'Rejected',
      value: workers.filter((w) => w.status === 'Rejected').length,
      icon: <XCircle size={22} className="text-red-600" />,
      bg: 'bg-red-50',
    },
    {
      label: 'Needs Info',
      value: workers.filter((w) => w.status === 'NeedsInfo').length,
      icon: <AlertTriangle size={22} className="text-orange-600" />,
      bg: 'bg-orange-50',
    },
  ];

  const statusBadgeVariant = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      case 'NeedsInfo': return 'warning';
      default: return 'info';
    }
  };

  const toggleActionMenu = (id) => {
    setActionMenuOpenId((prev) => (prev === id ? null : id));
  };

  const openDrawer = (worker) => {
    setSelectedWorker(worker);
    setIsDrawerOpen(true);
    setActionMenuOpenId(null);
  };

  const handleApprove = (worker) => {
    setApproveTarget(worker);
    setActionMenuOpenId(null);
  };

  const confirmApprove = () => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === approveTarget.id ? { ...w, status: 'Approved' } : w))
    );
    setApproveTarget(null);
    toast.success(`${approveTarget.name} has been approved.`);
    if (selectedWorker?.id === approveTarget.id) {
      setSelectedWorker((prev) => (prev ? { ...prev, status: 'Approved' } : null));
    }
  };

  const handleReject = (worker) => {
    setRejectTarget(worker);
    setActionMenuOpenId(null);
  };

  const confirmReject = () => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === rejectTarget.id ? { ...w, status: 'Rejected' } : w))
    );
    setRejectTarget(null);
    toast.success(`${rejectTarget.name} has been rejected.`);
    if (selectedWorker?.id === rejectTarget.id) {
      setSelectedWorker((prev) => (prev ? { ...prev, status: 'Rejected' } : null));
    }
  };

  const handleRequestDocs = (worker) => {
    setRequestDocsTarget(worker);
    setRequestDocsRemarks('');
    setActionMenuOpenId(null);
  };

  const submitRequestDocs = () => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === requestDocsTarget.id ? { ...w, status: 'NeedsInfo' } : w
      )
    );
    toast.info(`Request sent to ${requestDocsTarget.name} for additional documents.`);
    setRequestDocsTarget(null);
    if (selectedWorker?.id === requestDocsTarget.id) {
      setSelectedWorker((prev) => (prev ? { ...prev, status: 'NeedsInfo' } : null));
    }
  };

  const drawerApprove = () => {
    const w = selectedWorker;
    if (!w) return;
    setWorkers((prev) =>
      prev.map((x) => (x.id === w.id ? { ...x, status: 'Approved' } : x))
    );
    setSelectedWorker((prev) => (prev ? { ...prev, status: 'Approved' } : null));
    toast.success(`${w.name} has been approved.`);
    setIsDrawerOpen(false);
  };

  const drawerReject = () => {
    const w = selectedWorker;
    if (!w) return;
    setWorkers((prev) =>
      prev.map((x) => (x.id === w.id ? { ...x, status: 'Rejected' } : x))
    );
    setSelectedWorker((prev) => (prev ? { ...prev, status: 'Rejected' } : null));
    toast.success(`${w.name} has been rejected.`);
    setIsDrawerOpen(false);
  };

  const drawerRequestDocs = () => {
    const w = selectedWorker;
    if (!w) return;
    setRequestDocsTarget(w);
    setRequestDocsRemarks('');
  };

  const renderSkeletonRows = () =>
    Array.from({ length: 5 }).map((_, i) => (
      <tr key={`skel-${i}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Skeleton className="h-4 w-24" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Skeleton className="h-4 w-28" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Skeleton className="h-4 w-16" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Skeleton className="h-5 w-20 rounded-full" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Skeleton className="h-5 w-5 rounded-full ml-auto" />
        </td>
      </tr>
    ));

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Verification</h1>
          <p className="text-gray-500 mt-1">Review and manage worker verification applications</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          + Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center"
          >
            <div className={`p-4 rounded-lg ${stat.bg} mr-4`}>{stat.icon}</div>
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
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="NeedsInfo">Needs Info</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading
              ? renderSkeletonRows()
              : paginatedWorkers.length > 0
              ? paginatedWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {worker.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                          <div className="text-sm text-gray-500">{worker.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{worker.category}</div>
                      <div className="text-sm text-gray-500">{worker.experience} yrs exp</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1.5 text-gray-400" />
                        {worker.appliedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{worker.documents.length}</span>
                      <span className="text-sm text-gray-500"> files</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusBadgeVariant(worker.status)}>{worker.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => toggleActionMenu(worker.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {actionMenuOpenId === worker.id && (
                        <div
                          ref={actionMenuRef}
                          className="absolute right-8 top-10 w-56 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1"
                        >
                          <button
                            onClick={() => openDrawer(worker)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            <Eye size={16} className="mr-2 text-gray-400" /> View Details
                          </button>
                          <button
                            onClick={() => handleApprove(worker)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            <CheckCircle size={16} className="mr-2 text-green-500" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(worker)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            <XCircle size={16} className="mr-2 text-red-500" /> Reject
                          </button>
                          <button
                            onClick={() => handleRequestDocs(worker)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            <Upload size={16} className="mr-2 text-amber-500" /> Request Additional Documents
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <UserX size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No workers found</h3>
                      <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {!isLoading && filteredWorkers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Worker Details"
        width="w-[500px]"
      >
        {selectedWorker && (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                {selectedWorker.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedWorker.name}</h3>
                <p className="text-gray-500 text-sm">{selectedWorker.id}</p>
                <div className="mt-2">
                  <Badge variant={statusBadgeVariant(selectedWorker.status)}>
                    {selectedWorker.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-3 text-gray-400" /> {selectedWorker.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-3 text-gray-400" /> {selectedWorker.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-3 text-gray-400" /> Applied {selectedWorker.appliedDate}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Professional Profile</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{selectedWorker.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Experience</p>
                  <p className="font-semibold text-gray-900">{selectedWorker.experience} Years</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{selectedWorker.bio}</p>
              <div className="flex flex-wrap gap-2">
                {selectedWorker.skills.map((skill) => (
                  <Badge key={skill} variant="primary">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Documents ({selectedWorker.documents.length})
              </h4>
              <div className="space-y-3">
                {selectedWorker.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <FileText size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 flex flex-col gap-3">
              <button
                onClick={drawerApprove}
                className="w-full px-4 py-2.5 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={16} className="inline mr-2" /> Approve Worker
              </button>
              <button
                onClick={drawerReject}
                className="w-full px-4 py-2.5 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                <XCircle size={16} className="inline mr-2" /> Reject Worker
              </button>
              <button
                onClick={drawerRequestDocs}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload size={16} className="inline mr-2" /> Request Additional Documents
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmationDialog
        isOpen={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={confirmApprove}
        title="Approve Worker"
        message={`Are you sure you want to approve "${approveTarget?.name}"? They will be granted access to accept service bookings.`}
        confirmLabel="Approve"
        variant="success"
      />

      <ConfirmationDialog
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={confirmReject}
        title="Reject Worker"
        message={`Are you sure you want to reject "${rejectTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Reject"
        variant="danger"
      />

      <Modal
        isOpen={!!requestDocsTarget}
        onClose={() => setRequestDocsTarget(null)}
        title="Request Additional Documents"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send a request to <span className="font-semibold text-gray-900">{requestDocsTarget?.name}</span> for additional documents. Their status will be updated to "Needs Info" until the documents are submitted.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              rows={4}
              value={requestDocsRemarks}
              onChange={(e) => setRequestDocsRemarks(e.target.value)}
              placeholder="Specify what documents are needed (e.g., updated ID, proof of address)..."
              className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setRequestDocsTarget(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitRequestDocs}
              disabled={!requestDocsRemarks.trim()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                requestDocsRemarks.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Send Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkerVerification;
