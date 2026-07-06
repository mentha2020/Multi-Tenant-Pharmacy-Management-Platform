import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, AlertTriangle, Package, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/pharmacy/dashboard');
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders);
      setLowStockAlerts(response.data.lowStockAlerts);
      setSalesData(response.data.salesData || [
        { day: 'Mon', sales: 1200, orders: 12 },
        { day: 'Tue', sales: 1800, orders: 18 },
        { day: 'Wed', sales: 1500, orders: 15 },
        { day: 'Thu', sales: 2200, orders: 22 },
        { day: 'Fri', sales: 1900, orders: 19 },
        { day: 'Sat', sales: 2800, orders: 28 },
        { day: 'Sun', sales: 1600, orders: 16 },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Today's Sales", value: `$${(stats?.today_sales || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-500', change: '+12%', link: '/pharmacy/pos' },
    { label: "Today's Orders", value: stats?.today_orders || 0, icon: ShoppingCart, color: 'bg-blue-500', change: '+8%', link: '/pharmacy/orders' },
    { label: 'Low Stock Items', value: stats?.low_stock_items || 0, icon: AlertTriangle, color: 'bg-yellow-500', change: '-2', link: '/pharmacy/stock' },
    { label: 'Total Medicines', value: stats?.total_medicines || 0, icon: Package, color: 'bg-purple-500', change: '+5', link: '/pharmacy/medicines' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</span>
          <button onClick={loadDashboard} className="text-green-600 hover:text-green-700 text-sm font-medium">Refresh</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500 ml-1">{stat.change}</span>
                    <span className="text-sm text-gray-400 ml-1">vs yesterday</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Bar dataKey="sales" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/pharmacy/pos" className="bg-green-600 text-white p-4 rounded-xl text-center hover:bg-green-700 transition-colors">
          <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
          <span className="font-medium">New Sale</span>
        </Link>
        <Link to="/pharmacy/medicines" className="bg-blue-600 text-white p-4 rounded-xl text-center hover:bg-blue-700 transition-colors">
          <Package className="h-8 w-8 mx-auto mb-2" />
          <span className="font-medium">Add Medicine</span>
        </Link>
        <Link to="/pharmacy/orders" className="bg-purple-600 text-white p-4 rounded-xl text-center hover:bg-purple-700 transition-colors">
          <Clock className="h-8 w-8 mx-auto mb-2" />
          <span className="font-medium">View Orders</span>
        </Link>
        <Link to="/pharmacy/stock" className="bg-yellow-600 text-white p-4 rounded-xl text-center hover:bg-yellow-700 transition-colors">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <span className="font-medium">Stock Report</span>
        </Link>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link to="/pharmacy/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">View All</Link>
          </div>
          <div className="p-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div>
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-gray-500">{order.customer?.name || 'Guest'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${order.total}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
          </div>
          <div className="p-4">
            {lowStockAlerts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No low stock alerts</p>
            ) : (
              <div className="space-y-3">
                {lowStockAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">{alert.medicine?.name}</p>
                        <p className="text-sm text-gray-500">Batch: {alert.batch_no || 'N/A'}</p>
                      </div>
                    </div>
                    <span className="text-red-600 font-bold">{alert.quantity} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
