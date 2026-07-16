import React, { useState } from 'react';
import { 
  ShieldAlert, Search, Filter, Monitor, Smartphone, 
  Globe, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import Pagination from '../../components/ui/Pagination';

const generateAuditLogs = (count) => {
  const actions = ['Login', 'Logout', 'Update Profile', 'Delete Worker', 'Refund Booking', 'Change Password', 'Export Report'];
  const modules = ['Auth', 'Users', 'Workers', 'Bookings', 'Payments', 'Settings', 'Reports'];
  const statuses = ['Success', 'Failed'];
  const admins = ['Super Admin', 'Finance Admin', 'Support Agent 1', 'Operations Manager'];
  const devices = ['MacBook Pro', 'Windows PC', 'iPhone 13', 'Samsung S22'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];

  return Array.from({ length: count }, (_, i) => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const status = action === 'Login' && Math.random() > 0.8 ? 'Failed' : 'Success';
    const device = devices[Math.floor(Math.random() * devices.length)];

    return {
      id: `LOG-${80000 + i}`,
      timestamp: new Date(Date.now() - Math.random() * 500000000).toLocaleString(),
      admin: admins[Math.floor(Math.random() * admins.length)],
      action: action,
      module: modules[Math.floor(Math.random() * modules.length)],
      target: `ID-${Math.floor(Math.random() * 9000) + 1000}`,
      device: device,
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      status: status,
      isMobile: device.includes('iPhone') || device.includes('Samsung')
    };
  });
};

const mockLogs = generateAuditLogs(60);

const AuditLogs = () => {
  const [logs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const logsPerPage = 12;

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.admin.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.ip.includes(searchTerm);
    const matchesModule = filterModule === 'All' || l.module === filterModule;
    return matchesSearch && matchesModule;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  const stats = [
    { label: "Today's Activities", value: 142, icon: <ShieldAlert className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Failed Logins', value: 3, icon: <XCircle className="text-red-500" />, bg: 'bg-red-50' },
    { label: 'Critical Actions', value: 12, icon: <AlertTriangle className="text-orange-500" />, bg: 'bg-orange-50' },
    { label: 'Active Sessions', value: 8, icon: <CheckCircle className="text-green-500" />, bg: 'bg-green-50' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Audit Logs</h1>
          <p className="text-gray-500 mt-1">Track and monitor all administrator activities</p>
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
            placeholder="Search by Admin, Action, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
          >
            <option value="All">All Modules</option>
            <option value="Auth">Authentication</option>
            <option value="Workers">Workers</option>
            <option value="Bookings">Bookings</option>
            <option value="Payments">Payments</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp / Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action & Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device & Location</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {paginatedLogs.length > 0 ? paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{log.admin}</div>
                  <div className="text-xs text-gray-500">{log.timestamp}</div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs mr-2">{log.module}</span>
                    {log.action}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: {log.target}</div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center text-gray-700">
                    {log.isMobile ? <Smartphone size={14} className="mr-2 text-gray-400" /> : <Monitor size={14} className="mr-2 text-gray-400" />}
                    {log.device} • {log.browser}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Globe size={12} className="mr-1" /> {log.ip}
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right">
                  {log.status === 'Success' ? (
                    <span className="inline-flex items-center text-green-600 font-medium">
                      <CheckCircle size={14} className="mr-1" /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600 font-medium">
                      <XCircle size={14} className="mr-1" /> Failed
                    </span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredLogs.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
};

export default AuditLogs;
