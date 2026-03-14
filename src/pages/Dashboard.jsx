import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  Star,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentAccounts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [accounts, users, orders] = await Promise.all([
        api.get('/accounts'),
        api.get('/admin/users?limit=5'),
        api.get('/admin/orders?limit=5')
      ]);

      const totalRevenue = orders.data.data?.reduce((sum, order) => sum + order.amount, 0) || 0;
      const pendingOrders = orders.data.data?.filter(o => o.status === 'pending').length || 0;

      setStats({
        totalAccounts: accounts.data.total || 0,
        totalUsers: users.data.total || 0,
        totalOrders: orders.data.total || 0,
        totalRevenue,
        pendingOrders,
        recentAccounts: accounts.data.data?.slice(0, 5) || [],
        recentOrders: orders.data.data?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Accounts',
      value: stats.totalAccounts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      change: '+23%',
      trend: 'up'
    },
    {
      title: 'Revenue',
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+15%',
      trend: 'up'
    }
  ];

  const chartData = [
    { name: 'Mon', accounts: 40, users: 24, orders: 18 },
    { name: 'Tue', accounts: 30, users: 13, orders: 22 },
    { name: 'Wed', accounts: 20, users: 28, orders: 34 },
    { name: 'Thu', accounts: 27, users: 39, orders: 28 },
    { name: 'Fri', accounts: 18, users: 48, orders: 42 },
    { name: 'Sat', accounts: 23, users: 38, orders: 35 },
    { name: 'Sun', accounts: 34, users: 43, orders: 40 },
  ];

  const pieData = [
    { name: 'Facebook', value: 35 },
    { name: 'Instagram', value: 25 },
    { name: 'TikTok', value: 20 },
    { name: 'Twitter', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#C9A84C', '#3B82F6', '#EC4899', '#1DA1F2', '#6B7280'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A84C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <span className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-serif font-bold mb-4">Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAccounts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="accounts" stroke="#C9A84C" fillOpacity={1} fill="url(#colorAccounts)" />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="orders" stroke="#EC4899" fill="#EC4899" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-serif font-bold mb-4">Accounts by Platform</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Accounts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold">Recent Accounts</h2>
              <button className="text-sm text-[#C9A84C] hover:underline">View All</button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentAccounts.map((account) => (
              <div key={account._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B6914] bg-opacity-10 flex items-center justify-center">
                      <Package size={18} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{account.title?.substring(0, 30)}...</p>
                      <p className="text-xs text-gray-500">₦{account.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    account.available > 0 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {account.available > 0 ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold">Recent Orders</h2>
              <button className="text-sm text-[#C9A84C] hover:underline">View All</button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 bg-opacity-10 flex items-center justify-center">
                      <ShoppingBag size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Order #{order._id?.slice(-6)}</p>
                      <p className="text-xs text-gray-500">₦{order.amount?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'completed' ? 'bg-green-50 text-green-600' :
                      order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;