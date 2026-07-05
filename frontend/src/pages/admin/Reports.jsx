import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Building2, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('monthly');

  useEffect(() => {
    loadReport();
  }, [dateRange]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/super-admin/reports', { params: { range: dateRange } });
      setReportData(response.data);
    } catch (error) {
      toast.error('Failed to load reports');
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

  const revenueData = reportData?.revenue || [
    { month: 'Jan', revenue: 12500, orders: 45 },
    { month: 'Feb', revenue: 15000, orders: 52 },
    { month: 'Mar', revenue: 18200, orders: 68 },
    { month: 'Apr', revenue: 16800, orders: 58 },
    { month: 'May', revenue: 21000, orders: 75 },
    { month: 'Jun', revenue: 19500, orders: 70 },
  ];

  const topMedicines = reportData?.topMedicines || [
    { name: 'Paracetamol', sales: 320, revenue: 4800 },
    { name: 'Amoxicillin', sales: 280, revenue: 5600 },
    { name: 'Ibuprofen', sales: 250, revenue: 3750 },
    { name: 'Cetirizine', sales: 220, revenue: 3300 },
    { name: 'Omeprazole', sales: 200, revenue: 4000 },
  ];

  const categoryDistribution = reportData?.categories || [
    { name: 'Pain Relief', value: 35 },
    { name: 'Antibiotics', value: 25 },
    { name: 'Allergy', value: 15 },
    { name: 'Digestive', value: 12 },
    { name: 'Others', value: 13 },
  ];

  const topPharmacies = reportData?.topPharmacies || [
    { name: 'Health Plus', orders: 156, revenue: 23400 },
    { name: 'City Pharmacy', orders: 132, revenue: 19800 },
    { name: 'MedCare', orders: 118, revenue: 17700 },
    { name: 'PharmaHub', orders: 95, revenue: 14250 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Platform-wide performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none">
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$93,000', change: '+18%', icon: DollarSign, color: 'bg-green-500' },
          { label: 'Total Orders', value: '368', change: '+24%', icon: ShoppingCart, color: 'bg-blue-500' },
          { label: 'Avg Order Value', value: '$252', change: '+5%', icon: TrendingUp, color: 'bg-purple-500' },
          { label: 'Active Pharmacies', value: '12', change: '+2', icon: Building2, color: 'bg-yellow-500' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <span className="text-sm text-green-500 font-medium">{card.change} vs prev period</span>
                </div>
                <div className={`${card.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Medicines */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Top Selling Medicines</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topMedicines} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" width={100} stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Pharmacies */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Top Pharmacies</h2>
          <div className="space-y-4">
            {topPharmacies.map((pharmacy, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">{idx + 1}</div>
                  <div>
                    <p className="font-medium text-sm">{pharmacy.name}</p>
                    <p className="text-xs text-gray-500">{pharmacy.orders} orders</p>
                  </div>
                </div>
                <p className="font-bold text-green-600">${pharmacy.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
