import React, { useState } from 'react';
import {
  Search, Filter, Plus, MoreVertical, Edit3, Trash2, Ban, Mail,
  Phone, MapPin, ShieldCheck, UserCheck, UserX, RotateCcw, Eye
} from 'lucide-react';
import Drawer from '../../components/ui/Drawer';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

const generateUsers = (count) => {
  const statuses = ['Active', 'Pending', 'Suspended'];
  const verification = ['Verified', 'Pending', 'Needs Review'];
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: `USR-${1000 + i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      address: `${Math.floor(1 + Math.random() * 999)} Main St, City ${i}`,
      registeredAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      verification: verification[Math.floor(Math.random() * verification.length)],
      bookings: Math.floor(Math.random() * 20),
    });
  }
  return users;
};

const mockUsers = generateUsers(50);

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [draftUser, setDraftUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const itemsPerPage = 10;

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <Badge variant="success">Active</Badge>;
      case 'Suspended': return <Badge variant="danger">Suspended</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Soft Deleted': return <Badge variant="default">Soft Deleted</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setDraftUser({ ...user });
    setIsDrawerOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    setUsers((prev) => prev.map((user) => (user.id === draftUser.id ? draftUser : user)));
    setSelectedUser(draftUser);
    setIsDrawerOpen(false);
  };

  const requestAction = (type, user) => {
    setConfirmAction({ type, user });
  };

  const confirmActionHandler = () => {
    const { type, user } = confirmAction;
    if (type === 'suspend') {
      setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, status: 'Suspended' } : entry)));
    }
    if (type === 'reactivate') {
      setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, status: 'Active' } : entry)));
    }
    if (type === 'soft-delete') {
      setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, status: 'Soft Deleted' } : entry)));
    }
    if (type === 'restore') {
      setUsers((prev) => prev.map((entry) => (entry.id === user.id ? { ...entry, status: 'Active' } : entry)));
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Users Management</h1>
          <p className="text-gray-500 mt-1">Manage customer accounts, verification, and account lifecycle actions.</p>
        </div>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-navy">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Verified</p>
            <p className="text-2xl font-semibold text-green-600">{users.filter((u) => u.verification === 'Verified').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Suspended</p>
            <p className="text-2xl font-semibold text-red-600">{users.filter((u) => u.status === 'Suspended').length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-96 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Soft Deleted">Soft Deleted</option>
            </select>
          </div>
          <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
            Showing {currentUsers.length} of {filteredUsers.length} users
          </div>
        </CardHeader>

        <div className="overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Details</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length === 0 ? (
                <TableRow hover={false}>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-navy">No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentUsers.map((user) => (
                <TableRow key={user.id}>
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
                  <TableCell><Badge variant={user.verification === 'Verified' ? 'success' : user.verification === 'Needs Review' ? 'warning' : 'default'}>{user.verification}</Badge></TableCell>
                  <TableCell className="text-gray-500">{user.registeredAt}</TableCell>
                  <TableCell><span className="font-medium text-navy bg-gray-100 px-2 py-1 rounded-md">{user.bookings}</span></TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleViewUser(user)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Profile"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => requestAction(user.status === 'Suspended' ? 'reactivate' : 'suspend', user)} className="p-2 text-gray-400 hover:text-warning hover:bg-warning/10 rounded-lg transition-colors" title={user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}>
                        {user.status === 'Suspended' ? <UserCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
                      <button onClick={() => requestAction(user.status === 'Soft Deleted' ? 'restore' : 'soft-delete', user)} className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors" title={user.status === 'Soft Deleted' ? 'Restore' : 'Delete'}>
                        {user.status === 'Soft Deleted' ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-navy">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-navy">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium text-navy">{filteredUsers.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</Button>
            <div className="flex space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                }
                return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-navy'}`}>{pageNum}</button>;
              })}
            </div>
            <Button variant="secondary" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="User Profile" width="w-[480px]">
        {draftUser && (
          <form onSubmit={handleSaveUser} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">{draftUser.name.charAt(0)}</div>
              <div>
                <h3 className="font-semibold text-navy">{draftUser.name}</h3>
                <p className="text-sm text-gray-500">{draftUser.id}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input value={draftUser.name} onChange={(e) => setDraftUser({ ...draftUser, name: e.target.value })} className="mt-1 w-full border border-border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input value={draftUser.email} onChange={(e) => setDraftUser({ ...draftUser, email: e.target.value })} className="mt-1 w-full border border-border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input value={draftUser.phone} onChange={(e) => setDraftUser({ ...draftUser, phone: e.target.value })} className="mt-1 w-full border border-border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Account Status</label>
                <select value={draftUser.status} onChange={(e) => setDraftUser({ ...draftUser, status: e.target.value })} className="mt-1 w-full border border-border rounded-lg px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Soft Deleted">Soft Deleted</option>
                </select>
              </div>
            </div>
            <div className="border-t border-border pt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center"><Mail className="h-4 w-4 mr-2 text-gray-400" /> {draftUser.email}</div>
              <div className="flex items-center"><Phone className="h-4 w-4 mr-2 text-gray-400" /> {draftUser.phone}</div>
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-gray-400" /> {draftUser.address}</div>
              <div className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-gray-400" /> Verification: {draftUser.verification}</div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Drawer>

      <ConfirmationDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmActionHandler}
        title={confirmAction?.type === 'soft-delete' ? 'Soft Delete User' : confirmAction?.type === 'restore' ? 'Restore User' : confirmAction?.type === 'suspend' ? 'Suspend User' : 'Reactivate User'}
        message={confirmAction?.type === 'soft-delete' ? `Soft delete ${confirmAction?.user?.name}?` : confirmAction?.type === 'restore' ? `Restore ${confirmAction?.user?.name}?` : confirmAction?.type === 'suspend' ? `Suspend ${confirmAction?.user?.name}?` : `Reactivate ${confirmAction?.user?.name}?`}
        confirmLabel={confirmAction?.type === 'soft-delete' ? 'Soft Delete' : confirmAction?.type === 'restore' ? 'Restore' : confirmAction?.type === 'suspend' ? 'Suspend' : 'Reactivate'}
        variant={confirmAction?.type === 'soft-delete' || confirmAction?.type === 'suspend' ? 'danger' : 'success'}
      />
    </div>
  );
};

export default Users;
