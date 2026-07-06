import { useState, useEffect } from 'react';
import { Plus, X, Package, Clock, CheckCircle, Truck, Eye } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SupplyRequests() {
  const [requests, setRequests] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [formData, setFormData] = useState({ items: [{ medicine_id: '', quantity: '', cost_price: '' }], notes: '' });

  useEffect(() => {
    loadRequests();
    loadMedicines();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await api.get('/pharmacy/supply-requests');
      setRequests(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load supply requests');
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

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { medicine_id: '', quantity: '', cost_price: '' }] });
  };

  const removeItem = (index) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pharmacy/supply-requests', formData);
      toast.success('Supply request submitted');
      setShowModal(false);
      setFormData({ items: [{ medicine_id: '', quantity: '', cost_price: '' }], notes: '' });
      loadRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    }
  };

  const viewDetail = async (request) => {
    try {
      const response = await api.get(`/pharmacy/supply-requests/${request.id}`);
      setSelectedRequest(response.data);
      setShowDetail(true);
    } catch (error) {
      toast.error('Failed to load details');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supply Requests</h1>
          <p className="text-gray-500 mt-1">Request medicine supply from admin</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Request
        </button>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Request #</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div></td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No supply requests yet</td></tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{request.supply_number}</td>
                  <td className="px-6 py-4">{request.items?.length || 0} items</td>
                  <td className="px-6 py-4 font-bold text-green-600">${request.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[request.status]}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(request.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => viewDetail(request)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold">New Supply Request</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                    <select required value={item.medicine_id} onChange={(e) => updateItem(index, 'medicine_id', e.target.value)} className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                      <option value="">Select Medicine</option>
                      {medicines.map((med) => (<option key={med.id} value={med.id}>{med.name}</option>))}
                    </select>
                    <input type="number" required placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className="w-24 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                    <input type="number" step="0.01" required placeholder="Cost" value={item.cost_price} onChange={(e) => updateItem(index, 'cost_price', e.target.value)} className="w-28 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" />
                    {formData.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="h-4 w-4" /></button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItem} className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Item
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none" rows={2} placeholder="Additional notes..." />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Request #{selectedRequest.supply_number}</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selectedRequest.status]}`}>
                  {selectedRequest.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Date</span>
                <span>{new Date(selectedRequest.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-green-600 text-lg">${selectedRequest.total}</span>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="text-left py-2 px-3">Medicine</th><th className="text-left py-2 px-3">Qty</th><th className="text-left py-2 px-3">Cost</th></tr></thead>
                <tbody>
                  {selectedRequest.items?.map((item, idx) => (
                    <tr key={idx} className="border-t"><td className="py-2 px-3">{item.medicine?.name}</td><td className="py-2 px-3">{item.quantity}</td><td className="py-2 px-3">${item.cost_price}</td></tr>
                  ))}
                </tbody>
              </table>
              {selectedRequest.notes && (
                <div><p className="text-sm text-gray-500 mb-1">Notes</p><p className="bg-gray-50 p-3 rounded-lg text-sm">{selectedRequest.notes}</p></div>
              )}
            </div>
            <div className="p-6 border-t">
              <button onClick={() => setShowDetail(false)} className="w-full py-2 border rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
