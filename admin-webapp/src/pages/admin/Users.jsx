import React, { useState } from 'react';
import { 
  Search, Filter, Plus, MoreVertical, 
  Edit, Trash2, Ban, ShieldCheck, Mail, Phone,
  Eye, UserCheck, RotateCcw, AlertCircle, UserX, X
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import Modal from '../../components/ui/Modal';
import Drawer from '../../components/ui/Drawer';
import { useFakeLoading } from '../../hooks/useFakeLoading';
import { useToast } from '../../context/ToastContext';

// Mock Data Generator
const generateUsers = (count) => {
  const statuses = ['Active', 'Active', 'Active', 'Suspended', 'Pending'];
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: `USR-${1000 + i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      phone: `+63 9${Math.floor(10 + Math.random() * 90)}${Math.floor(1000000 + Math.random() * 9000000)}`,
      address: `${Math.floor(1 + Math.random() * 999)} Rizal St, City ${i}`,
      registeredAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      bookings: Math.floor(Math.random() * 20),
      verified: Math.random() > 0.2,
      deleted: false,
    });
  }
  return users;
};

const mockUsers = generateUsers(50);

const Users = () => {
  const isLoading = useFakeLoading(600);
  const toast = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // Modal states
  const [confirmModal, setConfirmModal] = useState({ open: false, type: '', user: null });
  const [editDrawer, setEditDrawer] = useState({ open: false, user: null });
  const [viewDrawer, setViewDrawer] = useState({ open: false, user: null });

  const itemsPerPage = 10;

  const toggleActionMenu = (id) => {
    if (actionMenuOpenId === id) setActionMenuOpenId(null);
    else setActionMenuOpenId(id);
  };

  // Filter (exclude deleted)
  const filteredUsers = users.filter(user => {
    if (user.deleted) return false;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openConfirm = (type, user) => {
    setConfirmModal({ open: true, type, user });
    setActionMenuOpenId(null);
  };

  const handleConfirm = () => {
    const { type, user } = confirmModal;
    if (type === 'suspend') {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Suspended' } : u));
      toast.success('User Suspended', `${user.name} has been suspended.`);
    } else if (type === 'reactivate') {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'Active' } : u));
      toast.success('User Reactivated', `${user.name}'s account is now active.`);
    } else if (type === 'softdelete') {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, deleted: true } : u));
      toast.info('User Deleted', `${user.name} moved to Trash.`);
    } else if (type === 'permdelete') {
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.error('User Permanently Deleted', `${user.name} has been permanently removed.`);
    }
    setConfirmModal({ open: false, type: '', user: null });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <Badge variant="success">Active</Badge>;
      case 'Suspended': return <Badge variant="danger">Suspended</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getConfirmConfig = () => {
    const { type, user } = confirmModal;
    const configs = {
      suspend: {
        title: 'Suspend User Account',
        icon: <UserX className="h-10 w-10 text-warning mx-auto mb-3" />,
        message: `Are you sure you want to suspend <strong>${user?.name}</strong>? They will lose access to their account.`,
        confirmLabel: 'Suspend',
        confirmClass: 'bg-warning hover:bg-yellow-600 text-white',
      },
      reactivate: {
        title: 'Reactivate User Account',
        icon: <UserCheck className="h-10 w-10 text-success mx-auto mb-3" />,
        message: `Restore access for <strong>${user?.name}</strong>? Their account will become active again.`,
        confirmLabel: 'Reactivate',
        confirmClass: 'bg-success hover:bg-green-600 text-white',
      },
      softdelete: {
        title: 'Delete User Account',
        icon: <AlertCircle className="h-10 w-10 text-danger mx-auto mb-3" />,
        message: `Move <strong>${user?.name}</strong> to Trash? You can restore this account within 30 days.`,
        confirmLabel: 'Move to Trash',
        confirmClass: 'bg-danger hover:bg-red-700 text-white',
      },
      permdelete: {
        title: 'Permanently Delete',
        icon: <Trash2 className="h-10 w-10 text-danger mx-auto mb-3" />,
        message: `Permanently delete <strong>${user?.name}</strong>? This action <strong>cannot be undone</strong>.`,
        confirmLabel: 'Delete Permanently',
        confirmClass: 'bg-danger hover:bg-red-700 text-white',
      },
    };
    return configs[type] || {};
  };

  const config = getConfirmConfig();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Users Management</h1>
          <p className="text-gray-500 mt-1">Manage customer accounts, view details, and handle suspensions.</p>
        </div>
        <div className="flex space-x-2">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        {/* Table Toolbar */}
        <CardHeader className="py-4 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-80 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
                {filteredUsers.length} users
              </div>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                </TableHead>
                <TableHead>User Details</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length === 0 ? (
                <TableRow hover={false}>
                  <TableCell colSpan={8} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-navy">No users found</p>
                      <p className="text-sm">We couldn't find any users matching your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center"><Skeleton className="h-4 w-4 rounded" /></TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="w-10 h-10 rounded-full mr-3 shrink-0" />
                        <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div>
                      </div>
                    </TableCell>
                    <TableCell><div className="space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-32" /></div></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-10 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                currentUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="text-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 mr-3">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-navy">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <span className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> {user.email}
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> {user.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{user.registeredAt}</TableCell>
                    <TableCell>
                      <span className="font-medium text-navy bg-gray-100 px-2 py-1 rounded-md text-sm">{user.bookings}</span>
                    </TableCell>
                    <TableCell>
                      {user.verified ? (
                        <span className="inline-flex items-center text-xs font-medium text-success">
                          <ShieldCheck size={14} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-gray-400">Unverified</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right relative">
                      <button
                        onClick={() => toggleActionMenu(user.id)}
                        className="text-gray-400 hover:text-navy p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {actionMenuOpenId === user.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActionMenuOpenId(null)} />
                          <div className="absolute right-8 top-10 w-52 bg-white rounded-xl shadow-xl border border-border z-20 py-1.5 text-left">
                            <button onClick={() => { setViewDrawer({ open: true, user }); setActionMenuOpenId(null); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Eye size={15} className="mr-2.5 text-gray-400" /> View Profile
                            </button>
                            <button onClick={() => { setEditDrawer({ open: true, user }); setActionMenuOpenId(null); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              <Edit size={15} className="mr-2.5 text-gray-400" /> Edit User
                            </button>
                            <div className="border-t border-border my-1" />
                            {user.status === 'Suspended' ? (
                              <button onClick={() => openConfirm('reactivate', user)} className="flex items-center w-full px-4 py-2 text-sm text-success hover:bg-success/5">
                                <UserCheck size={15} className="mr-2.5 text-success" /> Reactivate
                              </button>
                            ) : (
                              <button onClick={() => openConfirm('suspend', user)} className="flex items-center w-full px-4 py-2 text-sm text-warning hover:bg-warning/5">
                                <Ban size={15} className="mr-2.5 text-warning" /> Suspend User
                              </button>
                            )}
                            <button onClick={() => openConfirm('softdelete', user)} className="flex items-center w-full px-4 py-2 text-sm text-danger hover:bg-danger/5">
                              <Trash2 size={15} className="mr-2.5 text-danger" /> Move to Trash
                            </button>
                          </div>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-navy">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)}</span> to{' '}
            <span className="font-medium text-navy">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
            <span className="font-medium text-navy">{filteredUsers.length}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              Previous
            </Button>
            <div className="flex space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      currentPage === pageNum ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-navy'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <Button variant="secondary" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, type: '', user: null })} title={config.title || ''}>
        <div className="text-center pb-2">
          {config.icon}
          <p className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: config.message || '' }} />
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setConfirmModal({ open: false, type: '', user: null })}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${config.confirmClass}`}
            >
              {config.confirmLabel}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Profile Drawer */}
      <Drawer isOpen={viewDrawer.open} onClose={() => setViewDrawer({ open: false, user: null })} title="User Profile">
        {viewDrawer.user && (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                {viewDrawer.user.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-navy">{viewDrawer.user.name}</h3>
                <p className="text-gray-500 text-sm">{viewDrawer.user.id}</p>
                <div className="mt-1">{getStatusBadge(viewDrawer.user.status)}</div>
              </div>
            </div>
            <div className="border-t border-border pt-5 space-y-4">
              <div className="flex items-center text-sm text-gray-600"><Mail size={15} className="mr-3 text-gray-400" /> {viewDrawer.user.email}</div>
              <div className="flex items-center text-sm text-gray-600"><Phone size={15} className="mr-3 text-gray-400" /> {viewDrawer.user.phone}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-5">
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500 mb-1">Registered</p><p className="font-semibold text-navy text-sm">{viewDrawer.user.registeredAt}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500 mb-1">Total Bookings</p><p className="font-semibold text-navy text-sm">{viewDrawer.user.bookings}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500 mb-1">Verification</p><p className={`font-semibold text-sm ${viewDrawer.user.verified ? 'text-success' : 'text-gray-500'}`}>{viewDrawer.user.verified ? 'Verified' : 'Unverified'}</p></div>
              <div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500 mb-1">Account Status</p><p className="font-semibold text-navy text-sm">{viewDrawer.user.status}</p></div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit User Drawer */}
      <Drawer isOpen={editDrawer.open} onClose={() => setEditDrawer({ open: false, user: null })} title="Edit User">
        {editDrawer.user && (
          <form onSubmit={(e) => { e.preventDefault(); toast.success('User Updated', 'Profile changes saved.'); setEditDrawer({ open: false, user: null }); }} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input defaultValue={editDrawer.user.name} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input defaultValue={editDrawer.user.email} type="email" className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input defaultValue={editDrawer.user.phone} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <select defaultValue={editDrawer.user.status} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option>Active</option>
                <option>Suspended</option>
                <option>Pending</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4 border-t border-border">
              <button type="button" onClick={() => setEditDrawer({ open: false, user: null })} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </form>
        )}
      </Drawer>
    </div>
  );
};

export default Users;
