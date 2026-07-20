import React from 'react';

const DashboardCard = ({ title, value, icon, trend, trendValue, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
      <div className={`flex items-center justify-center w-14 h-14 rounded-full ${colorClass} bg-opacity-10 mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {trend && (
            <span className={`ml-2 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
