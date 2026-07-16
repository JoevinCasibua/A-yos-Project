import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CalendarCheck, 
  Wrench, 
  CreditCard, 
  Star, 
  FileText, 
  BarChart3, 
  Bell, 
  ShieldAlert, 
  Settings, 
  UserCircle,
  LogOut
} from 'lucide-react';

const AdminSidebar = ({ isOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Workers', icon: <Briefcase size={20} />, path: '/admin/workers' },
    { name: 'Bookings', icon: <CalendarCheck size={20} />, path: '/admin/bookings' },
    { name: 'Services', icon: <Wrench size={20} />, path: '/admin/services' },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/admin/payments' },
    { name: 'Reviews', icon: <Star size={20} />, path: '/admin/reviews' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/admin/reports' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/admin/analytics' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/admin/notifications' },
    { name: 'Audit Logs', icon: <ShieldAlert size={20} />, path: '/admin/auditlogs' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    { name: 'Profile', icon: <UserCircle size={20} />, path: '/admin/profile' },
  ];

  return (
    <div className={`bg-white text-gray-800 w-64 flex-shrink-0 border-r border-gray-200 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-64 hidden'}`}>
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">A-yos Admin</span>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
