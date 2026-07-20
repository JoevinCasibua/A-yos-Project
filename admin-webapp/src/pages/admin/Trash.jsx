import React, { useState } from 'react';
import { 
  Trash2, Search, RotateCcw, ShieldAlert,
  AlertCircle, CheckSquare, Square, Grid
} from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';

const generateDeletedItems = (type, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `DEL-${Math.floor(Math.random() * 90000) + 10000}`,
    item: `${type} ${i + 1}`,
    deletedBy: ['Super Admin', 'Admin (John)', 'System Auto'][Math.floor(Math.random() * 3)],
    deletedDate: new Date(Date.now() - Math.random() * 2000000000).toISOString().split('T')[0],
    restoreDeadline: new Date(Date.now() + Math.random() * 2592000000).toISOString().split('T')[0],
    selected: false,
  }));
};

const initialData = {
  Users: generateDeletedItems('User', 15),
  Workers: generateDeletedItems('Worker', 8),
  Bookings: generateDeletedItems('Booking', 25),
  Services: generateDeletedItems('Service', 4),
  Categories: generateDeletedItems('Category', 3),
  Reviews: generateDeletedItems('Review', 12),
};

const Trash = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('Users');
  const [items, setItems] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', id: null, bulk: false });

  const itemsPerPage = 10;
  const currentItems = items[activeTab];

  const filteredItems = currentItems.filter(item =>
    item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const selectedIds = currentItems.filter(i => i.selected).map(i => i.id);
  const allPageSelected = paginatedItems.length > 0 && paginatedItems.every(i => i.selected);

  const toggleSelect = (id) => {
    setItems(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(i => i.id === id ? { ...i, selected: !i.selected } : i),
    }));
  };

  const toggleSelectAll = () => {
    const shouldSelect = !allPageSelected;
    const pageIds = new Set(paginatedItems.map(i => i.id));
    setItems(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(i => pageIds.has(i.id) ? { ...i, selected: shouldSelect } : i),
    }));
  };

  const openConfirm = (type, id = null, bulk = false) => {
    setConfirmModal({ open: true, type, id, bulk });
  };

  const handleConfirm = () => {
    const { type, id, bulk } = confirmModal;
    const targetIds = bulk ? selectedIds : [id];

    if (type === 'restore') {
      setItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(i => !targetIds.includes(i.id)),
      }));
      toast.success('Restored', bulk ? `${targetIds.length} items restored successfully.` : 'Item restored successfully.');
    } else if (type === 'delete') {
      setItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(i => !targetIds.includes(i.id)),
      }));
      toast.error('Permanently Deleted', bulk ? `${targetIds.length} items permanently deleted.` : 'Item permanently deleted.');
    } else if (type === 'empty') {
      setItems(prev => ({ ...prev, [activeTab]: [] }));
      toast.error('Trash Emptied', `All ${activeTab} in trash have been permanently deleted.`);
    } else if (type === 'restoreAll') {
      setItems(prev => ({ ...prev, [activeTab]: [] }));
      toast.success('All Restored', `All ${filteredItems.length} ${activeTab} have been restored.`);
    }

    setConfirmModal({ open: false, type: '', id: null, bulk: false });
  };

  const getConfirmConfig = () => {
    const { type, bulk } = confirmModal;
    const count = bulk ? selectedIds.length : 1;
    const configs = {
      restore: { title: 'Restore Item(s)', icon: <RotateCcw className="h-10 w-10 text-success mx-auto mb-3" />, message: `Restore ${bulk ? `<strong>${count} selected</strong> items` : 'this item'}? They will be returned to their original location.`, confirmLabel: 'Restore', cls: 'bg-success hover:bg-green-600 text-white' },
      delete: { title: 'Permanently Delete', icon: <Trash2 className="h-10 w-10 text-danger mx-auto mb-3" />, message: `Permanently delete ${bulk ? `<strong>${count} selected</strong> items` : 'this item'}? This action <strong>cannot be undone</strong>.`, confirmLabel: 'Delete Permanently', cls: 'bg-danger hover:bg-red-700 text-white' },
      empty: { title: 'Empty Trash', icon: <ShieldAlert className="h-10 w-10 text-danger mx-auto mb-3" />, message: `Permanently delete <strong>all ${filteredItems.length} items</strong> in ${activeTab} trash? This action <strong>cannot be undone</strong>.`, confirmLabel: 'Empty Trash', cls: 'bg-danger hover:bg-red-700 text-white' },
      restoreAll: { title: 'Restore All', icon: <RotateCcw className="h-10 w-10 text-success mx-auto mb-3" />, message: `Restore <strong>all ${filteredItems.length} items</strong> back from trash?`, confirmLabel: 'Restore All', cls: 'bg-success hover:bg-green-600 text-white' },
    };
    return configs[type] || {};
  };

  const cfg = getConfirmConfig();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Trash & Recovery</h1>
          <p className="text-gray-500 mt-1">Manage soft-deleted items before permanent removal (30 days)</p>
        </div>
        {filteredItems.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {selectedIds.length > 0 && (
              <>
                <button onClick={() => openConfirm('restore', null, true)} className="bg-success/10 text-success border border-success/20 hover:bg-success/20 px-3 py-2 rounded-lg font-medium transition-colors text-sm flex items-center">
                  <RotateCcw size={15} className="mr-1.5" /> Restore ({selectedIds.length})
                </button>
                <button onClick={() => openConfirm('delete', null, true)} className="bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 px-3 py-2 rounded-lg font-medium transition-colors text-sm flex items-center">
                  <Trash2 size={15} className="mr-1.5" /> Delete ({selectedIds.length})
                </button>
              </>
            )}
            <button onClick={() => openConfirm('restoreAll')} className="bg-white border border-border hover:bg-gray-50 text-navy px-3 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center text-sm">
              <RotateCcw size={15} className="mr-1.5" /> Restore All
            </button>
            <button onClick={() => openConfirm('empty')} className="bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 px-3 py-2 rounded-lg font-medium transition-colors text-sm flex items-center">
              <Trash2 size={15} className="mr-1.5" /> Empty Trash
            </button>
          </div>
        )}
      </div>

      {/* Warning Banner */}
      <div className="mb-5 flex items-start gap-3 bg-warning/10 border border-warning/20 rounded-xl p-4">
        <AlertCircle size={18} className="text-warning shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          <strong>Heads up:</strong> Items in the trash will be <strong>permanently deleted after 30 days</strong> from their deletion date. Restore important items before the deadline.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b border-border overflow-x-auto">
          {Object.keys(initialData).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); setSearchTerm(''); }}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary bg-primary/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab === 'Categories' ? <Grid size={14} /> : null}
              {tab}
              <span className={`py-0.5 px-2 rounded-full text-xs font-bold ${
                activeTab === tab ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600'
              }`}>
                {items[tab].length}
              </span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-border bg-gray-50/50">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search deleted ${activeTab.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {selectedIds.length > 0 && (
              <span className="text-sm text-gray-500 font-medium">{selectedIds.length} selected</span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center w-12">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-primary transition-colors">
                    {allPageSelected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deleted Item</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deleted By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Deleted</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Restore Deadline</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {paginatedItems.length > 0 ? paginatedItems.map((item) => {
                const deadlineDate = new Date(item.restoreDeadline);
                const daysLeft = Math.ceil((deadlineDate - Date.now()) / 86400000);
                const isUrgent = daysLeft <= 5;
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.selected ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleSelect(item.id)} className="text-gray-400 hover:text-primary transition-colors">
                        {item.selected ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-navy">{item.item}</div>
                      <div className="text-xs text-gray-500">{item.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.deletedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.deletedDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isUrgent ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                      }`}>
                        <AlertCircle size={11} className="mr-1" />
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'} · {item.restoreDeadline}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openConfirm('restore', item.id)}
                          className="flex items-center px-3 py-1.5 text-xs font-medium text-success bg-success/10 border border-success/20 rounded-lg hover:bg-success/20 transition-colors"
                        >
                          <RotateCcw size={13} className="mr-1" /> Restore
                        </button>
                        <button
                          onClick={() => openConfirm('delete', item.id)}
                          className="flex items-center px-3 py-1.5 text-xs font-medium text-danger bg-danger/10 border border-danger/20 rounded-lg hover:bg-danger/20 transition-colors"
                        >
                          <ShieldAlert size={13} className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <Trash2 size={48} className="text-gray-300 mb-4 mx-auto" />
                    <p className="text-lg font-medium text-navy">Trash is empty</p>
                    <p className="text-gray-500 mt-1">No deleted {activeTab.toLowerCase()} found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredItems.length > 0 && (
          <div className="border-t border-border">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, type: '', id: null, bulk: false })} title={cfg.title || ''}>
        <div className="text-center pb-2">
          {cfg.icon}
          <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: cfg.message || '' }} />
          <div className="flex gap-3 mt-6">
            <button onClick={() => setConfirmModal({ open: false, type: '', id: null, bulk: false })} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleConfirm} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${cfg.cls}`}>
              {cfg.confirmLabel}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Trash;
