import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, Users, HardHat, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Trash2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { useFakeLoading } from '../../hooks/useFakeLoading';

// Mock Data
const revenueData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
];

const bookingsData = [
  { name: 'Mon', completed: 20, cancelled: 4, pending: 8 },
  { name: 'Tue', completed: 25, cancelled: 2, pending: 5 },
  { name: 'Wed', completed: 30, cancelled: 5, pending: 10 },
  { name: 'Thu', completed: 15, cancelled: 1, pending: 12 },
  { name: 'Fri', completed: 40, cancelled: 8, pending: 6 },
  { name: 'Sat', completed: 50, cancelled: 3, pending: 15 },
  { name: 'Sun', completed: 45, cancelled: 2, pending: 9 },
];

const initialActivities = [
  { id: 1, user: 'Sarah Jenkins', action: 'booked a Home Cleaning service', time: '10 mins ago', type: 'booking' },
  { id: 2, user: 'Mike Ross', action: 'registered as a Plumber', time: '1 hour ago', type: 'worker' },
  { id: 3, user: 'Payment of $120', action: 'was successful', time: '2 hours ago', type: 'payment' },
  { id: 4, user: 'Emma Watson', action: 'cancelled AC Repair service', time: '3 hours ago', type: 'cancel' },
  { id: 5, user: 'John Doe', action: 'left a 5-star review', time: '5 hours ago', type: 'review' },
];

const mockNewEvents = [
  { user: 'New User', action: 'just signed up', type: 'user' },
  { user: 'James Smith', action: 'booked Electrical Repair', type: 'booking' },
  { user: 'Payment of $85', action: 'was successful', type: 'payment' },
  { user: 'Alice Cooper', action: 'left a 4-star review', type: 'review' },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, isLoading }) => (
  <Card className="animate-fade-in-up">
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="flex flex-col mt-2">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-3xl font-display font-bold text-navy">{value}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <span className={`flex items-center font-medium mr-2 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                {trendValue}
              </span>
              {subtitle}
            </p>
          </>
        )}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const isLoading = useFakeLoading(800);
  const [activities, setActivities] = useState(initialActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to simulate a new event every 5 seconds
      if (Math.random() > 0.7) {
        const randomEvent = mockNewEvents[Math.floor(Math.random() * mockNewEvents.length)];
        const newActivity = {
          ...randomEvent,
          id: Date.now(), // unique ID for key
          time: 'Just now'
        };
        
        setActivities(prev => {
          const updated = [newActivity, ...prev].slice(0, 5); // Keep only 5
          return updated;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your ecosystem today.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium text-navy shadow-sm hover:bg-gray-50 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          icon={DollarSign}
          trend="up"
          trendValue="20.1%"
          subtitle="from last month"
          isLoading={isLoading}
        />
        <StatCard 
          title="Active Bookings" 
          value="+2350" 
          icon={Calendar}
          trend="up"
          trendValue="15.2%"
          subtitle="from last month"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Users" 
          value="12,234" 
          icon={Users}
          trend="up"
          trendValue="4.1%"
          subtitle="from last month"
          isLoading={isLoading}
        />
        <StatCard 
          title="Verified Workers" 
          value="842" 
          icon={HardHat}
          trend="down"
          trendValue="1.2%"
          subtitle="from last month"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and profit margins.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg min-h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B63D6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0B63D6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0B63D6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Weekly Bookings</CardTitle>
            <CardDescription>Booking statuses over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg min-h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="completed" stackId="a" fill="#22C55E" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="cancelled" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-start animate-fade-in-up transition-all duration-500">
                  <div className="relative">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary ring-4 ring-primary/10 transition-all duration-300"></div>
                    {index !== activities.length - 1 && (
                      <div className="absolute top-4 left-1 w-px h-full bg-border -ml-px transition-all duration-300"></div>
                    )}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium text-navy">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals (Mock Table) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Worker Approvals</CardTitle>
              <CardDescription>Workers waiting for profile verification.</CardDescription>
            </div>
            <button className="text-sm text-primary hover:underline font-medium">View All</button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Worker</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Date Applied</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-xs font-bold text-gray-500">
                            W{i}
                          </div>
                          <div>
                            <div className="font-medium text-navy">Worker Name {i}</div>
                            <div className="text-gray-500 text-xs">worker{i}@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">Plumbing</td>
                      <td className="px-4 py-3 text-gray-500">Oct {10 + i}, 2023</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="text-success hover:bg-success/10 p-1.5 rounded-md transition-colors" title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-danger hover:bg-danger/10 p-1.5 rounded-md transition-colors" title="Reject">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
