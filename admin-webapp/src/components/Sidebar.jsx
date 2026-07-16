import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, HardHat, CalendarCheck, 
  CreditCard, Wrench, Tags, Star, LifeBuoy, 
  FileText, BarChart2, LayoutTemplate, Bell, 
  History, Trash2, Settings, User, LogOut,
  ChevronLeft, ChevronRight, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', to: '/admin/users', icon: Users },
  { name: 'Workers', to: '/admin/workers', icon: HardHat },
  { name: 'Bookings', to: '/admin/bookings', icon: CalendarCheck },
  { name: 'Payments', to: '/admin/payments', icon: CreditCard },
  { name: 'Services', to: '/admin/services', icon: Wrench },
  { name: 'Reviews', to: '/admin/reviews', icon: Star },
  { name: 'Support', to: '/admin/support', icon: LifeBuoy },
  { name: 'Reports', to: '/admin/reports', icon: FileText },
  { name: 'Analytics', to: '/admin/analytics', icon: BarChart2 },
  { name: 'Notifications', to: '/admin/notifications', icon: Bell },
  { name: 'Audit Logs', to: '/admin/auditlogs', icon: History },
  { name: 'Trash', to: '/admin/trash', icon: Trash2 },
  { name: 'Settings', to: '/admin/settings', icon: Settings },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();

  const filteredNav = navigation.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside 
      className={`bg-navy text-gray-300 flex flex-col transition-all duration-300 ease-in-out relative z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-display font-bold text-white shrink-0">
              A
            </div>
            <span className="font-display font-bold text-lg text-white truncate">A-yos Admin</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-display font-bold text-white">
              A
            </div>
          </div>
        )}
      </div>

      {/* Search Input */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'pt-4' : 'pt-2'} px-3 space-y-1 custom-scrollbar`}>
        {filteredNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg transition-colors group
              ${isActive 
                ? 'bg-primary/10 text-white font-medium before:absolute before:left-0 before:h-8 before:w-1 before:bg-primary before:rounded-r-full relative' 
                : 'hover:bg-white/5 hover:text-white'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'} ${
              // Only active icons get primary color in this design
              ''
            }`} />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <NavLink
          to="/admin/profile"
          className={({ isActive }) => `
            flex items-center px-3 py-2.5 rounded-lg transition-colors group
            ${isActive ? 'bg-primary/10 text-white font-medium' : 'hover:bg-white/5 hover:text-white'}
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? "Profile" : undefined}
        >
          <User className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'}`} />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>

        <button
          onClick={logout}
          className={`
            w-full flex items-center px-3 py-2.5 rounded-lg transition-colors text-gray-300 hover:bg-danger/10 hover:text-danger
            ${isCollapsed ? 'justify-center' : ''}
          `}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'}`} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-cards border border-border text-navy rounded-full p-1 shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};

export default Sidebar;
