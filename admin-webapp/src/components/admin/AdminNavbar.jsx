import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

const AdminNavbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 border-b border-gray-200">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
        >
          <Menu size={24} />
        </button>
        <div className="ml-4 relative text-gray-400 focus-within:text-gray-600 hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white sm:text-sm transition duration-150 ease-in-out" 
            placeholder="Search..." 
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700 relative p-1 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <div className="relative flex items-center cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
            <User size={18} />
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
