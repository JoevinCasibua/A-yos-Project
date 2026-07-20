import React from 'react';
import { 
  BarChart3, TrendingUp, Users, Activity, 
  DollarSign, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// For a real app, we would use Recharts or Chart.js.
// Since we are generating a raw React component, we'll build CSS-based mock charts that look beautiful.

const Analytics = () => {

  const kpis = [
    { label: 'Conversion Rate', value: '4.8%', trend: '+0.5%', positive: true },
    { label: 'Customer LTV', value: '$450', trend: '+12%', positive: true },
    { label: 'Avg Booking Value', value: '$85', trend: '-2%', positive: false },
    { label: 'Repeat Customers', value: '38%', trend: '+5%', positive: true },
  ];

  // Mock data for bar chart
  const monthlyRevenue = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 38 },
    { month: 'Apr', value: 65 },
    { month: 'May', value: 72 },
    { month: 'Jun', value: 68 },
    { month: 'Jul', value: 90 },
    { month: 'Aug', value: 85 },
    { month: 'Sep', value: 95 },
    { month: 'Oct', value: 110 },
    { month: 'Nov', value: 105 },
    { month: 'Dec', value: 125 },
  ];

  // Mock data for horizontal bar
  const topServices = [
    { name: 'Deep Cleaning', percentage: 85 },
    { name: 'Plumbing Repair', percentage: 70 },
    { name: 'Electrical Wiring', percentage: 45 },
    { name: 'AC Installation', percentage: 35 },
    { name: 'Pest Control', percentage: 25 },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-500 mt-1">High-level metrics and growth trends</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm">
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* Primary Metrics (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <p className="text-sm text-gray-500 font-medium mb-2">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{kpi.value}</h3>
              <div className={`flex items-center text-sm font-medium ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend}
                {kpi.positive ? <ArrowUpRight size={16} className="ml-1" /> : <ArrowDownRight size={16} className="ml-1" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Main Chart (Revenue Trend) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <TrendingUp size={20} className="text-blue-500 mr-2" /> 
                Revenue Trend
              </h3>
              <p className="text-sm text-gray-500">Gross revenue over the selected period</p>
            </div>
            <h2 className="text-2xl font-bold text-blue-600">$845.5k</h2>
          </div>
          
          {/* CSS Mock Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 mt-4 pt-4 border-t border-gray-100">
            {monthlyRevenue.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group">
                {/* Tooltip (visible on hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  ${data.value}k
                </div>
                {/* Bar */}
                <div 
                  className="w-full bg-blue-100 rounded-t-md group-hover:bg-blue-600 transition-colors relative"
                  style={{ height: `${(data.value / 125) * 100}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md opacity-20" style={{height: '100%'}}></div>
                </div>
                {/* Label */}
                <span className="text-xs text-gray-500 mt-3 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Chart (Top Services) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center mb-6">
            <Activity size={20} className="text-indigo-500 mr-2" /> 
            Top Services
          </h3>
          
          <div className="space-y-6">
            {topServices.map((service, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{service.name}</span>
                  <span className="text-gray-500 font-bold">{service.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full" 
                    style={{ width: `${service.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Extra Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mr-6 shrink-0">
            <Users size={32} className="text-green-600" />
          </div>
          <div>
            <h4 className="text-gray-500 font-medium">Monthly Active Users (MAU)</h4>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-bold text-gray-900">45,200</span>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Compared to previous month</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mr-6 shrink-0">
            <DollarSign size={32} className="text-orange-600" />
          </div>
          <div>
            <h4 className="text-gray-500 font-medium">Avg. Worker Earnings / Mo</h4>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-bold text-gray-900">$1,250</span>
              <span className="text-sm font-medium text-green-600">+4%</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Across all verified workers</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
