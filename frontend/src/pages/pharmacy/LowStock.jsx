import { useState, useEffect } from 'react';
import { AlertTriangle, Package, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function LowStock() {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLowStock();
  }, []);

  const loadLowStock = async () => {
    try {
      const response = await api.get('/pharmacy/low-stock');
      setLowStockItems(response.data);
    } catch (error) {
      toast.error('Failed to load low stock items');
    } finally {
      setLoading(false);
    }
  };

  const outOfStock = lowStockItems.filter(item => item.quantity === 0);
  const criticalStock = lowStockItems.filter(item => item.quantity > 0 && item.quantity <= 5);
  const lowStock = lowStockItems.filter(item => item.quantity > 5 && item.quantity <= item.low_stock_threshold);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Low Stock Alerts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{lowStockItems.length} items need attention</p>
        </div>
        <Link to="/pharmacy/supply-requests" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Request Supply
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-700">{outOfStock.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Critical (1-5 units)</p>
              <p className="text-2xl font-bold text-yellow-700">{criticalStock.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-700">{lowStock.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">All Low Stock Items</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Medicine</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Batch No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Current Stock</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Threshold</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div></td></tr>
            ) : lowStockItems.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">All stock levels are healthy!</td></tr>
            ) : (
              lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 font-medium">{item.medicine?.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-sm">{item.batch_no || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${item.quantity === 0 ? 'text-red-600' : item.quantity <= 5 ? 'text-yellow-600' : 'text-orange-600'}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.low_stock_threshold}</td>
                  <td className="px-6 py-4">
                    {item.quantity === 0 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Out of Stock</span>
                    ) : item.quantity <= 5 ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Critical</span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">Low</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link to="/pharmacy/supply-requests" className="text-green-600 dark:text-green-400 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                      Request Supply <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
