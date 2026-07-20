import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, MoreVertical, Eye, Wifi, WifiOff, Clock,
  UserX, Star, Mail, Phone, MapPin, Calendar, UserCheck, Users
} from 'lucide-react';
import Drawer from '../../components/ui/Drawer';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import { useFakeLoading } from '../../hooks/useFakeLoading';
import { useToast } from '../../context/ToastContext';

const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'AC Repair', 'Painting', 'Pest Control'];
const statuses = ['Online', 'Offline', 'Busy', 'Suspended'];
const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle', 'Denver'];

const generateWorkers = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `WK-${2001 + i}`,
    name: `Worker ${i + 1}`,
    email: `worker${i + 1}@ayos.com`,
    phone: `+1 555 ${String(100 + i).padStart(3, '0')}-${String(1000 + i).padStart(4, '0')}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    availability: statuses[Math.floor(Math.random() * statuses.length)],
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 30)).toISOString(),
    rating: (Math.random() * 2 + 3).toFixed(1),
    jobsCompleted: Math.floor(Math.random() * 300) + 5,
    location: locations[Math.floor(Math.random() * locations.length)],
    registeredDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
  }));
};

const mockWorkers = generateWorkers(50);

const getRelativeTime = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const availabilityConfig = {
  Online: { variant: 'success', className: 'bg-green-100 text-green-800' },
  Offline: { variant: 'default', className: 'bg-gray-100 text-gray-800' },
  Busy: { variant: 'warning', className: 'bg-yellow-100 text-yellow-800' },
  Suspended: { variant: 'danger', className: 'bg-red-100 text-red-800' },
};

const WorkerAvailability = () => {
  const isLoading = useFakeLoading(600);
  const toast = useToast();
  const [workers, setWorkers] = useState(mockWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', worker: null });
  const dropdownRef = useRef(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActionMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || w.availability === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredWorkers.length / itemsPerPage);
  const paginatedWorkers = filteredWorkers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = [
    {
      label: 'Online Now',
      value: workers.filter((w) => w.availability === 'Online').length,
      icon: <Wifi size={22} className="text-blue-500" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Offline',
      value: workers.filter((w) => w.availability === 'Offline').length,
      icon: <WifiOff size={22} className="text-gray-500" />,
      bg: 'bg-gray-50',
    },
    {
      label: 'Busy',
      value: workers.filter((w) => w.availability === 'Busy').length,
      icon: <Clock size={22} className="text-yellow-500" />,
      bg: 'bg-yellow-50',
    },
    {
      label: 'Suspended',
      value: workers.filter((w) => w.availability === 'Suspended').length,
      icon: <UserX size={22} className="text-red-500" />,
      bg: 'bg-red-50',
    },
  ];

  const toggleActionMenu = (id) => {
    setActionMenuOpenId(actionMenuOpenId === id ? null : id);
  };

  const handleViewProfile = (worker) => {
    setSelectedWorker(worker);
    setIsDrawerOpen(true);
    setActionMenuOpenId(null);
  };

  const handleDisable = (worker) => {
    setConfirmDialog({ isOpen: true, type: 'disable', worker });
    setActionMenuOpenId(null);
  };

  const handleReactivate = (worker) => {
    setConfirmDialog({ isOpen: true, type: 'reactivate', worker });
    setActionMenuOpenId(null);
  };

  const confirmDisable = () => {
    const { worker } = confirmDialog;
    setWorkers(workers.map((w) => (w.id === worker.id ? { ...w, availability: 'Offline' } : w)));
    if (selectedWorker?.id === worker.id) {
      setSelectedWorker({ ...worker, availability: 'Offline' });
    }
    toast.success('Availability Disabled', `${worker.name} has been set to offline.`);
    setConfirmDialog({ isOpen: false, type: '', worker: null });
  };

  const confirmReactivate = () => {
    const { worker } = confirmDialog;
    setWorkers(workers.map((w) => (w.id === worker.id ? { ...w, availability: 'Online' } : w)));
    if (selectedWorker?.id === worker.id) {
      setSelectedWorker({ ...worker, availability: 'Online' });
    }
    toast.success('Availability Reactivated', `${worker.name} is now online.`);
    setConfirmDialog({ isOpen: false, type: '', worker: null });
  };

  const canDisable = (status) => status === 'Online' || status === 'Busy';
  const canReactivate = (status) => status === 'Offline' || status === 'Suspended';

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
              <Skeleton className="h-14 w-14 rounded-lg mr-4 shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-12" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-t-xl shadow-sm border-x border-t border-gray-100 p-4 mb-0">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="bg-white shadow-sm border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Worker', 'Category', 'Rating', 'Availability', 'Last Active', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                      <div className="ml-4 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
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
          <h1 className="text-2xl font-bold text-gray-900">Worker Availability</h1>
          <p className="text-gray-500 mt-1">Monitor and manage real-time availability status for all workers</p>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Filters and Search */}
      <div className="bg-white rounded-t-xl shadow-sm border-x border-t border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, ID, or category..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedWorkers.length > 0 ? (
              paginatedWorkers.map((worker) => (
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Star size={16} className="text-yellow-400 mr-1 fill-current" />
                      {worker.rating}
                    </div>
                    <div className="text-xs text-gray-500">{worker.jobsCompleted} jobs</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${availabilityConfig[worker.availability]?.className || 'bg-gray-100 text-gray-800'}`}>
                      {worker.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRelativeTime(worker.lastActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative" ref={actionMenuOpenId === worker.id ? dropdownRef : undefined}>
                    <button
                      onClick={() => toggleActionMenu(worker.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {actionMenuOpenId === worker.id && (
                      <div className="absolute right-8 top-10 w-52 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
                        <button
                          onClick={() => handleViewProfile(worker)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                        >
                          <Eye size={16} className="mr-2 text-gray-400" /> View Profile
                        </button>
                        {canDisable(worker.availability) && (
                          <button
                            onClick={() => handleDisable(worker)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            <UserX size={16} className="mr-2 text-gray-400" /> Disable Availability
                          </button>
                        )}
                        {canReactivate(worker.availability) && (
                          <button
                            onClick={() => handleReactivate(worker)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                          >
                            <UserCheck size={16} className="mr-2 text-gray-400" /> Reactivate Availability
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Users size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No workers found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredWorkers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Worker Profile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Worker Profile"
        width="w-[450px]"
      >
        {selectedWorker && (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                {selectedWorker.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedWorker.name}</h3>
                <p className="text-gray-500">{selectedWorker.id}</p>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${availabilityConfig[selectedWorker.availability]?.className || 'bg-gray-100 text-gray-800'}`}>
                    {selectedWorker.availability}
                  </span>
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
                  <MapPin size={16} className="mr-3 text-gray-400" /> {selectedWorker.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-3 text-gray-400" /> Registered {selectedWorker.registeredDate}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Work Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Rating</p>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 mr-1 fill-current" />
                    <p className="font-semibold text-gray-900">{selectedWorker.rating}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Jobs Completed</p>
                  <p className="font-semibold text-gray-900">{selectedWorker.jobsCompleted}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{selectedWorker.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Last Active</p>
                  <p className="font-semibold text-gray-900">{getRelativeTime(selectedWorker.lastActive)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Actions</h4>
              {canDisable(selectedWorker.availability) ? (
                <button
                  onClick={() => handleDisable(selectedWorker)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  Disable Availability
                </button>
              ) : canReactivate(selectedWorker.availability) ? (
                <button
                  onClick={() => handleReactivate(selectedWorker)}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  Reactivate Availability
                </button>
              ) : (
                <button disabled className="w-full px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">
                  No Actions Available
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Disable Confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'disable'}
        onClose={() => setConfirmDialog({ isOpen: false, type: '', worker: null })}
        onConfirm={confirmDisable}
        title="Disable Availability"
        message={`Are you sure you want to disable availability for ${confirmDialog.worker?.name}? They will appear as offline.`}
        confirmLabel="Disable"
        variant="danger"
        icon={UserX}
      />

      {/* Reactivate Confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'reactivate'}
        onClose={() => setConfirmDialog({ isOpen: false, type: '', worker: null })}
        onConfirm={confirmReactivate}
        title="Reactivate Availability"
        message={`Reactivate availability for ${confirmDialog.worker?.name}? They will be set to online.`}
        confirmLabel="Reactivate"
        variant="success"
        icon={UserCheck}
      />
    </div>
  );
};

export default WorkerAvailability;
