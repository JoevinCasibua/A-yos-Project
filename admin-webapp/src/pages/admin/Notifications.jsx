import React, { useState } from 'react';
import { 
  Bell, Send, Filter, Search, Copy, Trash2, 
  Mail, MessageSquare, Smartphone, CheckCircle, 
  XCircle, Clock, AlertCircle
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';

const generateNotifications = (count) => {
  const types = ['Email', 'SMS', 'Push'];
  const audiences = ['All Users', 'Workers Only', 'Customers Only', 'Inactive Users'];
  const statuses = ['Sent', 'Scheduled', 'Failed', 'Draft'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `NOTIF-${3000 + i}`,
    title: `Notification Campaign ${i + 1}`,
    audience: audiences[Math.floor(Math.random() * audiences.length)],
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    openRate: Math.floor(Math.random() * 80) + 10 + '%'
  }));
};

const mockNotifications = generateNotifications(40);

const Notifications = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({ title: '', audience: 'Everyone', channel: 'Push Notification', message: '', sendMode: 'immediate' });

  const notifsPerPage = 10;

  const filteredNotifs = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || n.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredNotifs.length / notifsPerPage);
  const paginatedNotifs = filteredNotifs.slice((currentPage - 1) * notifsPerPage, currentPage * notifsPerPage);

  const stats = [
    { label: 'Sent Today', value: 12, icon: <Send className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Scheduled', value: 5, icon: <Clock className="text-yellow-500" />, bg: 'bg-yellow-50' },
    { label: 'Drafts', value: 8, icon: <MessageSquare className="text-gray-500" />, bg: 'bg-gray-50' },
    { label: 'Failed Deliveries', value: 2, icon: <XCircle className="text-red-500" />, bg: 'bg-red-50' },
  ];

  const getTypeIcon = (type) => {
    if (type === 'Email') return <Mail size={16} className="text-gray-500" />;
    if (type === 'SMS') return <MessageSquare size={16} className="text-gray-500" />;
    return <Smartphone size={16} className="text-gray-500" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = () => {
    setNotifications(notifications.filter(n => n.id !== deleteModal.id));
    toast.info('Notification Deleted', 'The notification has been removed.');
    setDeleteModal({ open: false, id: null });
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Engine</h1>
          <p className="text-gray-500 mt-1">Manage email, SMS, and push notification campaigns</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center"
        >
          <Bell size={18} className="mr-2" /> Create Notification
        </button>
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
            placeholder="Search campaigns..."
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
            <option value="All">All Channels</option>
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="Push">Push Notification</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Audience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status / Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedNotifs.length > 0 ? paginatedNotifs.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{n.audience}</div>
                  {n.status === 'Sent' && <div className="text-xs text-green-600 font-medium">Open Rate: {n.openRate}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded inline-flex">
                    {getTypeIcon(n.type)}
                    <span className="ml-2 font-medium">{n.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium mb-1 ${getStatusColor(n.status)}`}>
                    {n.status}
                  </span>
                  <div className="text-xs text-gray-500">{n.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {n.status === 'Draft' && (
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition-colors" title="Send Now">
                        <Send size={18} />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-indigo-50 transition-colors" title="Duplicate">
                      <Copy size={18} />
                    </button>
                    <button onClick={() => handleDelete(n.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No notifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredNotifs.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Notification" maxWidth="max-w-2xl">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
            <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500" placeholder="e.g. Summer Promo" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select value={formData.audience} onChange={(e) => setFormData({ ...formData, audience: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Everyone</option>
                <option>Users Only</option>
                <option>Workers Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
              <select value={formData.channel} onChange={(e) => setFormData({ ...formData, channel: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Push Notification</option>
                <option>Email</option>
                <option>SMS</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500" placeholder="Type your message here..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Option</label>
            <select value={formData.sendMode} onChange={(e) => setFormData({ ...formData, sendMode: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="immediate">Send Immediately</option>
              <option value="scheduled">Schedule for Later</option>
              <option value="draft">Save as Draft</option>
            </select>
          </div>
          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">Cancel</button>
            <button type="button" onClick={() => setFormData({ ...formData, sendMode: 'draft' })} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">Save as Draft</button>
            <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center">
              <Send size={16} className="mr-2" /> {formData.sendMode === 'scheduled' ? 'Schedule' : 'Send Now'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} title="Delete Notification">
        <div className="text-center pb-2">
          <AlertCircle className="h-12 w-12 text-danger mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Are you sure you want to delete this notification? This action cannot be undone.</p>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setDeleteModal({ open: false, id: null })} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Notifications;
