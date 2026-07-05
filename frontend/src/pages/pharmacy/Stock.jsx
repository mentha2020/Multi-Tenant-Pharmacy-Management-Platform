import { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

export default function Stock() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', low_stock: false });

  useEffect(() => {
    loadStocks();
  }, [filters]);

  const loadStocks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pharmacy/stock', { params: filters });
      setStocks(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Stock
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search stock..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.low_stock}
              onChange={(e) => setFilters({ ...filters, low_stock: e.target.checked })}
              className="rounded text-green-600"
            />
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Low Stock Only
            </span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Selling Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  No stock records found
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{stock.medicine?.name}</td>
                  <td className="px-6 py-4 text-gray-500">{stock.batch_no || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={stock.quantity <= stock.low_stock_threshold ? 'text-red-600 font-bold' : ''}>
                      {stock.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">${stock.purchase_price}</td>
                  <td className="px-6 py-4">${stock.selling_price}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {stock.expiry_date ? new Date(stock.expiry_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {stock.quantity <= stock.low_stock_threshold ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Low Stock</span>
                    ) : stock.expiry_date && new Date(stock.expiry_date) < new Date() ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Expired</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">In Stock</span>
                    )}
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
