import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Download } from 'lucide-react';
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
      const rangeMap = { weekly: '7days', monthly: '30days', quarterly: '90days', yearly: '1year' };
      const apiRange = rangeMap[dateRange] || '30days';

      const [salesRes, revenueRes, inventoryRes, supplyRes] = await Promise.all([
        api.get('/super-admin/reports/sales', { params: { range: apiRange } }).catch(() => ({ data: null })),
        api.get('/super-admin/reports/revenue', { params: { range: apiRange } }).catch(() => ({ data: null })),
        api.get('/super-admin/reports/inventory').catch(() => ({ data: null })),
        api.get('/super-admin/reports/supply', { params: { range: apiRange } }).catch(() => ({ data: null })),
      ]);

      setReportData({
        sales: salesRes.data,
        revenue: revenueRes.data,
        inventory: inventoryRes.data,
        supply: supplyRes.data,
      });
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!reportData?.revenue?.revenueByMonth) return;
    const headers = ['Month', 'Revenue'];
    const rows = reportData.revenue.revenueByMonth.map(r => [`Month ${r.month}`, r.revenue]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const exportJSON = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const revenueData = reportData?.revenue?.revenueByMonth?.map(r => ({
    month: `Month ${r.month}`,
    revenue: Number(r.revenue),
  })) || [];

  const salesTrend = reportData?.sales?.salesTrend?.map(r => ({
    date: r.date,
    count: r.count,
    revenue: Number(r.revenue),
  })) || [];

  const categoryDistribution = reportData?.inventory?.categoryDistribution?.map(r => ({
    name: r.name,
    value: Number(r.total_quantity),
  })) || [];

  const topPharmacies = reportData?.sales?.topPharmacies?.map(r => ({
    name: r.pharmacy?.name || 'Unknown',
    orders: r.order_count,
    revenue: Number(r.revenue),
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Platform-wide performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-medium">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button onClick={exportJSON} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-medium">
            <Download className="h-4 w-4" />
            Export JSON
          </button>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white">
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
          {
            label: 'Total Revenue',
            value: `$${Number(reportData?.revenue?.totalRevenue || 0).toLocaleString()}`,
            change: '+18%',
            icon: DollarSign,
            color: 'bg-green-500',
          },
          {
            label: 'Total Orders',
            value: String(reportData?.sales?.totalOrders || 0),
            change: '+24%',
            icon: ShoppingCart,
            color: 'bg-blue-500',
          },
          {
            label: 'Platform Profit',
            value: `$${Number(reportData?.revenue?.profit || 0).toLocaleString()}`,
            change: '+5%',
            icon: TrendingUp,
            color: 'bg-purple-500',
          },
          {
            label: 'Inventory Items',
            value: String(reportData?.inventory?.totalMedicines || 0),
            change: `${reportData?.inventory?.lowStockItems || 0} low stock`,
            icon: BarChart3,
            color: 'bg-yellow-500',
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{card.value}</p>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Revenue Trend</h2>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Sales by Category</h2>
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

        {/* Supply Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Supply Overview</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply Orders</p>
              <p className="text-2xl font-bold dark:text-gray-100">{reportData?.supply?.totalSupplyOrders || 0}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply Value</p>
              <p className="text-2xl font-bold text-green-600">${Number(reportData?.supply?.totalSupplyValue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Top Pharmacies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Top Pharmacies</h2>
          <div className="space-y-4">
            {topPharmacies.length > 0 ? topPharmacies.map((pharmacy, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">{idx + 1}</div>
                  <div>
                    <p className="font-medium text-sm dark:text-gray-100">{pharmacy.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{pharmacy.orders} orders</p>
                  </div>
                </div>
                <p className="font-bold text-green-600">${pharmacy.revenue.toLocaleString()}</p>
              </div>
            )) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">No pharmacy data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
