import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Filter } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [filters, setFilters] = useState({ search: '', category_id: '', page: 1 });
  const [pagination, setPagination] = useState({});
  const [formData, setFormData] = useState({
    name: '', generic_name: '', brand: '', category_id: '', description: '', unit_price: '', manufacturer: '', requires_prescription: false
  });

  useEffect(() => {
    loadMedicines();
    loadCategories();
  }, [filters]);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pharmacy/medicines', { params: filters });
      setMedicines(response.data.data);
      setPagination(response.data);
    } catch (error) {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await api.put(`/pharmacy/medicines/${editingMedicine.id}`, formData);
        toast.success('Medicine updated successfully');
      } else {
        await api.post('/pharmacy/medicines', formData);
        toast.success('Medicine added successfully');
      }
      setShowModal(false);
      setEditingMedicine(null);
      resetForm();
      loadMedicines();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      generic_name: medicine.generic_name,
      brand: medicine.brand || '',
      category_id: medicine.category_id || '',
      description: medicine.description || '',
      unit_price: medicine.unit_price,
      manufacturer: medicine.manufacturer || '',
      requires_prescription: medicine.requires_prescription,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await api.delete(`/pharmacy/medicines/${id}`);
      toast.success('Medicine deleted successfully');
      loadMedicines();
    } catch (error) {
      toast.error('Failed to delete medicine');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', generic_name: '', brand: '', category_id: '', description: '', unit_price: '', manufacturer: '', requires_prescription: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Medicines</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{pagination.total || 0} medicines in your inventory</p>
        </div>
        <button onClick={() => { resetForm(); setEditingMedicine(null); setShowModal(true); }} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Medicine
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 dark:bg-gray-800">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input type="text" placeholder="Search medicines..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <select value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value, page: 1 })} className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">All Categories</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Generic Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rx</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan="7" className="px-6 py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div></td></tr>
            ) : medicines.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No medicines found</td></tr>
            ) : (
              medicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 font-medium">{medicine.name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{medicine.generic_name}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{medicine.brand || '-'}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{medicine.category?.name || '-'}</td>
                  <td className="px-6 py-4 font-medium text-green-600">${medicine.unit_price}</td>
                  <td className="px-6 py-4">
                    {medicine.requires_prescription ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(medicine)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(medicine.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                    </div>
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
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 dark:bg-gray-800">
            <div className="p-6 border-b flex items-center justify-between dark:border-gray-700">
              <h2 className="text-xl font-bold">{editingMedicine ? 'Edit Medicine' : 'Add Medicine'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Generic Name *</label>
                  <input type="text" required value={formData.generic_name} onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Price *</label>
                  <input type="number" step="0.01" required value={formData.unit_price} onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manufacturer</label>
                  <input type="text" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.requires_prescription} onChange={(e) => setFormData({ ...formData, requires_prescription: e.target.checked })} className="rounded text-green-600" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Requires Prescription</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{editingMedicine ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
