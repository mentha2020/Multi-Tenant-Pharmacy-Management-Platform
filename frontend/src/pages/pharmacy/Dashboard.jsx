import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, AlertTriangle, Package, Clock } from 'lucide-react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
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
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Today's Sales", value: `$${(stats?.today_sales || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { label: "Today's Orders", value: stats?.today_orders || 0, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Low Stock Items', value: stats?.low_stock_items || 0, icon: AlertTriangle, color: 'bg-yellow-500' },
    { label: 'Total Medicines', value: stats?.total_medicines || 0, icon: Package, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pharmacy Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <a href="/pharmacy/pos" className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700">
          <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
          <span className="font-medium">New Sale</span>
        </a>
        <a href="/pharmacy/medicines" className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700">
          <Package className="h-8 w-8 mx-auto mb-2" />
          <span className="font-medium">Add Medicine</span>
        </a>
        <a href="/pharmacy/orders" className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700">
          <Clock className="h-8 w-8 mx-auto mb-2" />
          <span className="font-medium">View Orders</span>
        </a>
        <a href="/pharmacy/stock" className="bg-yellow-600 text-white p-4 rounded-lg text-center hover:bg-yellow-700">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <span className="font-medium">Stock Report</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="p-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-gray-500">{order.customer?.name || 'Guest'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${order.total}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
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
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
          </div>
          <div className="p-4">
            {lowStockAlerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No low stock alerts</p>
            ) : (
              <div className="space-y-3">
                {lowStockAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">{alert.medicine?.name}</p>
                      <p className="text-sm text-gray-500">Batch: {alert.batch_no || 'N/A'}</p>
                    </div>
                    <span className="text-red-600 font-medium">
                      {alert.quantity} left
                    </span>
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
