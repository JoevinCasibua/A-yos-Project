import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, Calendar, Users, HardHat, Clock, CheckCircle, Trash2,
  FileWarning, CreditCard, Headphones, ClipboardList, Bell, Shield,
  Send, BarChart3, Wrench, Info, AlertTriangle, Gift, UserPlus,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { useFakeLoading } from '../../hooks/useFakeLoading';

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

const userGrowthData = [
  { month: 'Aug', users: 320 }, { month: 'Sep', users: 450 },
  { month: 'Oct', users: 580 }, { month: 'Nov', users: 720 },
  { month: 'Dec', users: 890 }, { month: 'Jan', users: 1050 },
  { month: 'Feb', users: 1180 }, { month: 'Mar', users: 1340 },
  { month: 'Apr', users: 1520 }, { month: 'May', users: 1700 },
  { month: 'Jun', users: 1890 }, { month: 'Jul', users: 2100 },
];

const serviceCategoryData = [
  { name: 'Plumbing', value: 30 },
  { name: 'Cleaning', value: 25 },
  { name: 'Electrical', value: 18 },
  { name: 'AC Repair', value: 12 },
  { name: 'Carpentry', value: 8 },
  { name: 'Pest Control', value: 7 },
];

const PIE_COLORS = ['#0B63D6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const recentUsers = [
  { name: 'Maria Santos', email: 'maria@example.com', date: 'Jul 15, 2025', status: 'Active' },
  { name: 'James Lee', email: 'james.lee@example.com', date: 'Jul 15, 2025', status: 'Pending' },
  { name: 'Aisha Khan', email: 'aisha.k@example.com', date: 'Jul 14, 2025', status: 'Active' },
  { name: 'Carlos Reyes', email: 'carlos.r@example.com', date: 'Jul 14, 2025', status: 'Active' },
  { name: 'Nina Patel', email: 'nina.p@example.com', date: 'Jul 13, 2025', status: 'Inactive' },
];

const supportTickets = [
  { id: 'TKT-401', subject: 'Payment not received', priority: 'High', status: 'Open' },
  { id: 'TKT-402', subject: 'Worker didn\'t show up', priority: 'Critical', status: 'Open' },
  { id: 'TKT-403', subject: 'App crash on booking', priority: 'Medium', status: 'Pending' },
  { id: 'TKT-404', subject: 'Refund request delayed', priority: 'High', status: 'In Progress' },
  { id: 'TKT-405', subject: 'Account locked', priority: 'Low', status: 'Resolved' },
];

const systemNotifications = [
  { id: 1, type: 'info', icon: Info, message: 'Database backup completed successfully.', time: '2h ago' },
  { id: 2, type: 'warning', icon: AlertTriangle, message: 'Server CPU usage above 85% threshold.', time: '4h ago' },
  { id: 3, type: 'info', icon: Gift, message: 'Summer promo campaign activated for 10% discount.', time: '6h ago' },
  { id: 4, type: 'info', icon: Shield, message: 'SSL certificate renewed for api.ayos.com.', time: '1d ago' },
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

const statusBadge = (s) => {
  const m = { Active: 'success', Pending: 'warning', Inactive: 'default', Open: 'danger', 'In Progress': 'info', Resolved: 'success' };
  return m[s] || 'default';
};

const priorityBadge = (p) => {
  const m = { Critical: 'danger', High: 'warning', Medium: 'info', Low: 'default' };
  return m[p] || 'default';
};

const notifColor = { info: 'bg-info/10 text-info', warning: 'bg-warning/10 text-warning' };

const dashboardStats = [
  { title: 'Total Users', value: '12,234', icon: Users, color: 'primary', trend: '+4.1%', subtitle: 'from last month' },
  { title: 'Total Workers', value: '842', icon: HardHat, color: 'primary', trend: '+2.4%', subtitle: 'verified workforce' },
  { title: 'Pending Worker Applications', value: '24', icon: FileWarning, color: 'warning', trend: '6 new', subtitle: 'awaiting review' },
  { title: 'Active Bookings', value: '2,350', icon: Calendar, color: 'primary', trend: '+15.2%', subtitle: 'in progress' },
  { title: 'Completed Bookings', value: '1,847', icon: CheckCircle, color: 'success', trend: '+8.7%', subtitle: 'this month' },
  { title: 'Pending Refunds', value: '8', icon: CreditCard, color: 'danger', trend: '2 urgent', subtitle: 'needs review' },
  { title: 'Support Tickets', value: '12', icon: Headphones, color: 'info', trend: '+3 today', subtitle: 'live queue' },
  { title: 'Revenue Overview', value: '$45,231', icon: DollarSign, color: 'primary', trend: '+20.1%', subtitle: 'monthly revenue' },
];

const Dashboard = () => {
  const isLoading = useFakeLoading(800);
  const [activities, setActivities] = useState(initialActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomEvent = mockNewEvents[Math.floor(Math.random() * mockNewEvents.length)];
        const newActivity = { ...randomEvent, id: Date.now(), time: 'Just now' };
        setActivities(prev => [newActivity, ...prev].slice(0, 5));
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={index % 2 === 0 ? 'up' : 'down'}
            trendValue={stat.trend}
            subtitle={stat.subtitle}
            isLoading={isLoading}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
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
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
                  <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly new user registrations over 12 months.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pb-4">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg min-h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Service Categories</CardTitle>
            <CardDescription>Bookings distribution by service type.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pb-4 flex items-center justify-center">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg min-h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceCategoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {serviceCategoryData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Widgets Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent User Registrations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>New users this week.</CardDescription>
            </div>
            <button className="text-sm text-primary hover:underline font-medium">View All</button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-y border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="font-medium text-navy">{u.name}</div>
                      <div className="text-gray-500 text-xs">{u.email}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{u.date}</td>
                    <td className="px-6 py-3"><Badge variant={statusBadge(u.status)}>{u.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recent Support Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Recent help requests.</CardDescription>
            </div>
            <button className="text-sm text-primary hover:underline font-medium">View All</button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-y border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Ticket</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {supportTickets.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="font-medium text-navy">{t.id}</div>
                      <div className="text-gray-500 text-xs truncate max-w-[180px]">{t.subject}</div>
                    </td>
                    <td className="px-6 py-3"><Badge variant={priorityBadge(t.priority)}>{t.priority}</Badge></td>
                    <td className="px-6 py-3"><Badge variant={statusBadge(t.status)}>{t.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Quick Actions + System Notifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/admin/worker-verification" className="flex items-center gap-2 px-4 py-3 bg-primary/5 hover:bg-primary/10 border border-border rounded-lg text-sm font-medium text-navy transition-colors">
                  <Shield className="h-4 w-4 text-primary" /> Approve Workers
                </Link>
                <Link to="/admin/notifications" className="flex items-center gap-2 px-4 py-3 bg-primary/5 hover:bg-primary/10 border border-border rounded-lg text-sm font-medium text-navy transition-colors">
                  <Send className="h-4 w-4 text-primary" /> Create Notification
                </Link>
                <Link to="/admin/reports" className="flex items-center gap-2 px-4 py-3 bg-primary/5 hover:bg-primary/10 border border-border rounded-lg text-sm font-medium text-navy transition-colors">
                  <BarChart3 className="h-4 w-4 text-primary" /> View Reports
                </Link>
                <Link to="/admin/services" className="flex items-center gap-2 px-4 py-3 bg-primary/5 hover:bg-primary/10 border border-border rounded-lg text-sm font-medium text-navy transition-colors">
                  <Wrench className="h-4 w-4 text-primary" /> Manage Services
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemNotifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-md mt-0.5 ${notifColor[n.type] || notifColor.info}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-navy">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Today's transaction overview.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-success/10 rounded-lg"><DollarSign className="h-4 w-4 text-success" /></div>
                    <span className="text-sm text-gray-600">Total Collected</span>
                  </div>
                  <span className="text-lg font-bold text-navy">$3,420</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-warning/10 rounded-lg"><Clock className="h-4 w-4 text-warning" /></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-navy">$680</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-danger/10 rounded-lg"><CreditCard className="h-4 w-4 text-danger" /></div>
                    <span className="text-sm text-gray-600">Refunds</span>
                  </div>
                  <span className="text-lg font-bold text-navy">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
