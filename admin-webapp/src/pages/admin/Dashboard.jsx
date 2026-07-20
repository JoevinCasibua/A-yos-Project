import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, Calendar, Users, HardHat, 
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Trash2,
  RefreshCcw, Headset, UserPlus, Bell, AlertTriangle,
  Zap, FileText, Settings, UserCheck, BookOpen, CreditCard,
  TrendingUp, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { useFakeLoading } from '../../hooks/useFakeLoading';

// Mock Data
const revenueData = [
  { name: 'Jan', revenue: 42000, profit: 24000 },
  { name: 'Feb', revenue: 38000, profit: 19800 },
  { name: 'Mar', revenue: 51000, profit: 30800 },
  { name: 'Apr', revenue: 47800, profit: 29080 },
  { name: 'May', revenue: 53890, profit: 38800 },
  { name: 'Jun', revenue: 61390, profit: 44800 },
  { name: 'Jul', revenue: 74900, profit: 55300 },
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

const servicePieData = [
  { name: 'Plumbing', value: 28, color: '#0B63D6' },
  { name: 'Cleaning', value: 22, color: '#22C55E' },
  { name: 'Electrical', value: 18, color: '#F59E0B' },
  { name: 'AC Repair', value: 16, color: '#EF4444' },
  { name: 'Others', value: 16, color: '#8B5CF6' },
];

const initialActivities = [
  { id: 1, user: 'Sarah Jenkins', action: 'booked a Home Cleaning service', time: '10 mins ago', type: 'booking' },
  { id: 2, user: 'Mike Ross', action: 'registered as a Plumber', time: '1 hour ago', type: 'worker' },
  { id: 3, user: 'Payment of ₱1,200', action: 'was confirmed (Cash)', time: '2 hours ago', type: 'payment' },
  { id: 4, user: 'Emma Watson', action: 'cancelled AC Repair service', time: '3 hours ago', type: 'cancel' },
  { id: 5, user: 'John Doe', action: 'left a 5-star review', time: '5 hours ago', type: 'review' },
];

const mockNewEvents = [
  { user: 'New User', action: 'just signed up', type: 'user' },
  { user: 'James Smith', action: 'booked Electrical Repair', type: 'booking' },
  { user: 'Payment of ₱850', action: 'was confirmed (Cash)', type: 'payment' },
  { user: 'Alice Cooper', action: 'left a 4-star review', type: 'review' },
  { user: 'Worker Application', action: 'submitted by Carlos R.', type: 'worker' },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, isLoading, color = 'primary' }) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
  };
  return (
    <Card className="animate-fade-in-up">
      <CardContent className="p-5">
        <div className="flex items-center justify-between pb-2">
          <h3 className="tracking-tight text-xs font-semibold text-gray-500 uppercase">{title}</h3>
          <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.primary}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col mt-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div className="text-2xl font-display font-bold text-navy">{value}</div>
              {trendValue && (
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <span className={`flex items-center font-medium mr-2 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                    {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                    {trendValue}
                  </span>
                  {subtitle}
                </p>
              )}
              {!trendValue && subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const isLoading = useFakeLoading(800);
  const [activities, setActivities] = useState(initialActivities);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomEvent = mockNewEvents[Math.floor(Math.random() * mockNewEvents.length)];
        const newActivity = { ...randomEvent, id: Date.now(), time: 'Just now' };
        setActivities(prev => [newActivity, ...prev].slice(0, 6));
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { label: 'Review Worker Applications', icon: UserCheck, to: '/admin/workers', color: 'text-primary bg-primary/10 hover:bg-primary/20', badge: '14' },
    { label: 'Process Refund Requests', icon: RefreshCcw, to: '/admin/payments', color: 'text-warning bg-warning/10 hover:bg-warning/20', badge: '3' },
    { label: 'View Open Support Tickets', icon: Headset, to: '/admin/support', color: 'text-info bg-info/10 hover:bg-info/20', badge: '8' },
    { label: 'Send Notification', icon: Bell, to: '/admin/notifications', color: 'text-success bg-success/10 hover:bg-success/20' },
    { label: 'Generate Report', icon: FileText, to: '/admin/reports', color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
    { label: 'System Settings', icon: Settings, to: '/admin/settings', color: 'text-gray-600 bg-gray-100 hover:bg-gray-200' },
  ];

  const activityTypeColor = {
    booking: 'bg-primary',
    worker: 'bg-success',
    payment: 'bg-warning',
    cancel: 'bg-danger',
    review: 'bg-info',
    user: 'bg-purple-500',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your A-yos ecosystem today.</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/admin/reports')}
            className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium text-navy shadow-sm hover:bg-gray-50 transition-colors flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>

      {/* Stat Cards — Row 1: 4 cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="12,234"
          icon={Users}
          trend="up"
          trendValue="4.1%"
          subtitle="vs last month"
          isLoading={isLoading}
          color="primary"
        />
        <StatCard
          title="Total Workers"
          value="842"
          icon={HardHat}
          trend="up"
          trendValue="2.3%"
          subtitle="vs last month"
          isLoading={isLoading}
          color="info"
        />
        <StatCard
          title="Pending Applications"
          value="14"
          icon={UserCheck}
          trend="up"
          trendValue="5"
          subtitle="awaiting review"
          isLoading={isLoading}
          color="warning"
        />
        <StatCard
          title="Active Bookings"
          value="2,350"
          icon={Calendar}
          trend="up"
          trendValue="15.2%"
          subtitle="vs last month"
          isLoading={isLoading}
          color="success"
        />
      </div>

      {/* Stat Cards — Row 2: 4 cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Completed Bookings"
          value="18,421"
          icon={CheckCircle}
          trend="up"
          trendValue="8.9%"
          subtitle="vs last month"
          isLoading={isLoading}
          color="success"
        />
        <StatCard
          title="Pending Refunds"
          value="3"
          icon={RefreshCcw}
          trend="up"
          trendValue="3"
          subtitle="since yesterday"
          isLoading={isLoading}
          color="danger"
        />
        <StatCard
          title="Support Tickets"
          value="45"
          icon={Headset}
          trend="down"
          trendValue="5"
          subtitle="resolved today"
          isLoading={isLoading}
          color="info"
        />
        <StatCard
          title="Total Revenue"
          value="₱369,190"
          icon={DollarSign}
          trend="up"
          trendValue="20.1%"
          subtitle="vs last month"
          isLoading={isLoading}
          color="primary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and profit margins.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[280px] pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg min-h-[280px]" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B63D6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0B63D6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#0B63D6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                  <Area type="monotone" dataKey="profit" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>Bookings by service category.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[280px] pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg min-h-[280px]" />
            ) : (
              <div className="flex flex-col items-center h-full">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={servicePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                      {servicePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 w-full mt-2">
                  {servicePieData.map((item) => (
                    <div key={item.name} className="flex items-center text-xs">
                      <span className="w-2.5 h-2.5 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="text-gray-600 truncate">{item.name}</span>
                      <span className="ml-auto font-semibold text-navy">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Bookings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Booking Trends</CardTitle>
          <CardDescription>Booking statuses over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[240px] pb-4">
          {isLoading ? (
            <Skeleton className="w-full h-60 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={bookingsData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Bar dataKey="completed" stackId="a" fill="#22C55E" radius={[0, 0, 4, 4]} name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
                <Bar dataKey="cancelled" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bottom Section — 3 columns */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-warning" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.to)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${action.color}`}
                  >
                    <ActionIcon className="h-4 w-4 shrink-0" />
                    <span className="ml-3 text-sm font-medium flex-1">{action.label}</span>
                    {action.badge && (
                      <span className="ml-auto bg-white/80 text-xs font-bold px-2 py-0.5 rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex items-start animate-fade-in-up">
                  <div className="relative shrink-0">
                    <div className={`w-2 h-2 mt-2 rounded-full ring-4 ring-white ${activityTypeColor[activity.type] || 'bg-primary'}`}></div>
                    {index !== activities.length - 1 && (
                      <div className="absolute top-4 left-1 w-px h-full bg-border -ml-px"></div>
                    )}
                  </div>
                  <div className="ml-4 space-y-0.5">
                    <p className="text-sm font-medium text-navy">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary + System Notifications */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>This month's financial snapshot.</CardDescription>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Cash Payments', value: '₱312,400', color: 'text-navy', sub: '847 transactions' },
                  { label: 'Platform Fee (15%)', value: '₱46,860', color: 'text-primary', sub: 'this month' },
                  { label: 'Pending Refunds', value: '₱3,800', color: 'text-danger', sub: '3 requests' },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Worker Approvals</CardTitle>
                <button onClick={() => navigate('/admin/workers')} className="text-sm text-primary hover:underline font-medium">View All</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-warning/20 flex items-center justify-center text-warning font-bold text-sm">
                        W{i}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">Worker Name {i}</p>
                        <p className="text-xs text-gray-500">Plumbing · Applied 2d ago</p>
                      </div>
                    </div>
                    <Badge variant="warning" className="text-xs">Pending</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Important alerts and platform updates.</CardDescription>
            </div>
            <div className="p-2 bg-warning/10 rounded-lg">
              <Bell className="h-5 w-5 text-warning" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-start space-x-3 p-3 bg-danger/5 border border-danger/20 rounded-lg">
              <div className="p-1.5 bg-danger/10 text-danger rounded-md shrink-0"><AlertTriangle size={16} /></div>
              <div>
                <p className="text-sm font-medium text-danger">Server Maintenance</p>
                <p className="text-xs text-gray-600 mt-1">Scheduled for tonight at 2:00 AM PHT.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-success/5 border border-success/20 rounded-lg">
              <div className="p-1.5 bg-success/10 text-success rounded-md shrink-0"><CheckCircle size={16} /></div>
              <div>
                <p className="text-sm font-medium text-success">New App Version</p>
                <p className="text-xs text-gray-600 mt-1">v2.4.1 has been deployed successfully.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-info/5 border border-info/20 rounded-lg">
              <div className="p-1.5 bg-info/10 text-info rounded-md shrink-0"><TrendingUp size={16} /></div>
              <div>
                <p className="text-sm font-medium text-info">Booking Milestone</p>
                <p className="text-xs text-gray-600 mt-1">Platform crossed 18,000 total completed bookings.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
