import { useState, useEffect } from 'react';
import { Building2, Users, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentPharmacies, setRecentPharmacies] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/super-admin/dashboard');
      setStats(response.data.stats);
      setRecentPharmacies(response.data.recentPharmacies);
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
    { label: 'Total Pharmacies', value: stats?.total_pharmacies || 0, icon: Building2, color: 'bg-blue-500' },
    { label: 'Active Pharmacies', value: stats?.active_pharmacies || 0, icon: Building2, color: 'bg-green-500' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `$${(stats?.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pharmacies */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Registrations</h2>
          </div>
          <div className="p-4">
            {recentPharmacies.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent registrations</p>
            ) : (
              <div className="space-y-3">
                {recentPharmacies.map((pharmacy) => (
                  <div key={pharmacy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{pharmacy.name}</p>
                      <p className="text-sm text-gray-500">{pharmacy.city}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${pharmacy.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {pharmacy.is_active ? 'Active' : 'Pending'}
                    </span>
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
                      <p className="text-sm text-gray-500">{alert.pharmacy?.name}</p>
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
