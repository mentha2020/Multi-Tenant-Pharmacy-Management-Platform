import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, AlertTriangle, X, Package } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Stock() {
  const [stocks, setStocks] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [filters, setFilters] = useState({ search: '', low_stock: false });
  const [formData, setFormData] = useState({
    medicine_id: '', quantity: '', purchase_price: '', selling_price: '', batch_no: '', expiry_date: '', low_stock_threshold: 10
  });

  useEffect(() => {
    loadStocks();
    loadMedicines();
  }, [filters]);

  const loadStocks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pharmacy/stock', { params: filters });
      setStocks(response.data.data);
    } catch (error) {
      toast.error('Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicines = async () => {
    try {
      const response = await api.get('/pharmacy/medicines', { params: { per_page: 100 } });
      setMedicines(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStock) {
        await api.put(`/pharmacy/stock/${editingStock.id}`, formData);
        toast.success('Stock updated successfully');
      } else {
        await api.post('/pharmacy/stock', formData);
        toast.success('Stock added successfully');
      }
      setShowModal(false);
      setEditingStock(null);
      resetForm();
      loadStocks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setFormData({
      medicine_id: stock.medicine_id,
      quantity: stock.quantity,
      purchase_price: stock.purchase_price,
      selling_price: stock.selling_price,
      batch_no: stock.batch_no || '',
      expiry_date: stock.expiry_date || '',
      low_stock_threshold: stock.low_stock_threshold || 10,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ medicine_id: '', quantity: '', purchase_price: '', selling_price: '', batch_no: '', expiry_date: '', low_stock_threshold: 10 });
  };

  const profitMargin = formData.selling_price && formData.purchase_price
    ? (((formData.selling_price - formData.purchase_price) / formData.purchase_price) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-500 mt-1">Manage your pharmacy inventory</p>
        </div>
        <button onClick={() => { resetForm(); setEditingStock(null); setShowModal(true); }} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Stock
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input type="text" placeholder="Search stock..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="checkbox" checked={filters.low_stock} onChange={(e) => setFilters({ ...filters, low_stock: e.target.checked })} className="rounded text-green-600" />
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Low Stock Only</span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Medicine</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Batch No</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Purchase Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Selling Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="8" className="px-6 py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div></td></tr>
            ) : stocks.length === 0 ? (
              <tr><td colSpan="8" className="px-6 py-12 text-center text-gray-500">No stock records found</td></tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{stock.medicine?.name}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-sm">{stock.batch_no || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={stock.quantity <= stock.low_stock_threshold ? 'text-red-600 font-bold' : 'font-medium'}>
                      {stock.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">${stock.purchase_price}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">${stock.selling_price}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {stock.expiry_date ? new Date(stock.expiry_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {stock.quantity <= stock.low_stock_threshold ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Low Stock</span>
                    ) : stock.expiry_date && new Date(stock.expiry_date) < new Date() ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Expired</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(stock)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingStock ? 'Edit Stock' : 'Add Stock'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine *</label>
                <select required value={formData.medicine_id} onChange={(e) => setFormData({ ...formData, medicine_id: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                  <option value="">Select Medicine</option>
                  {medicines.map((med) => (<option key={med.id} value={med.id}>{med.name} ({med.brand})</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input type="number" required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch No</label>
                  <input type="text" value={formData.batch_no} onChange={(e) => setFormData({ ...formData, batch_no: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
                  <input type="number" step="0.01" required value={formData.purchase_price} onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
                  <input type="number" step="0.01" required value={formData.selling_price} onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input type="date" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                  <input type="number" value={formData.low_stock_threshold} onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                </div>
              </div>
              {profitMargin > 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700">Profit Margin: <span className="font-bold">{profitMargin}%</span></p>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{editingStock ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
