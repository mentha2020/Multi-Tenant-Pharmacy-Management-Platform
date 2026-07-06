import { useState, useEffect } from 'react';
import { Truck, Search, Eye, CheckCircle, Package, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SupplyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/super-admin/supply-orders', { params: filters });
      setOrders(response.data.data);
      setPagination(response.data);
    } catch (error) {
      toast.error('Failed to load supply orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.patch(`/super-admin/supply-orders/${orderId}/status`, { status });
      toast.success('Status updated successfully');
      loadOrders();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to update status');
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

  const nextStatuses = {
    pending: 'confirmed',
    confirmed: 'shipped',
    shipped: 'in_transit',
    in_transit: 'delivered',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Supply Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage medicine supply to pharmacies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input type="text" placeholder="Search orders..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Pharmacy</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div></td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No supply orders found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 font-mono text-sm dark:text-gray-100">{order.supply_number}</td>
                  <td className="px-6 py-4 dark:text-gray-100">{order.pharmacy?.name}</td>
                  <td className="px-6 py-4 dark:text-gray-100">{order.items?.length || 0} items</td>
                  <td className="px-6 py-4 font-bold text-green-600">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="h-4 w-4" /></button>
                      {nextStatuses[order.status] && (
                        <button onClick={() => handleUpdateStatus(order.id, nextStatuses[order.status])} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title={`Mark as ${nextStatuses[order.status]}`}>
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold dark:text-gray-100">Supply Order #{selectedOrder.supply_number}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500 dark:text-gray-400">Pharmacy</p><p className="font-medium dark:text-gray-100">{selectedOrder.pharmacy?.name}</p></div>
                <div><p className="text-sm text-gray-500 dark:text-gray-400">Status</p><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[selectedOrder.status]}`}>{selectedOrder.status.replace('_', ' ')}</span></div>
                <div><p className="text-sm text-gray-500 dark:text-gray-400">Total</p><p className="font-bold text-green-600 text-lg">${selectedOrder.total}</p></div>
                <div><p className="text-sm text-gray-500 dark:text-gray-400">Profit Margin</p><p className="font-medium dark:text-gray-100">{selectedOrder.profit_margin}%</p></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Items</p>
                <table className="w-full border rounded-lg dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-2 text-left text-xs font-semibold dark:text-gray-300">Medicine</th><th className="px-4 py-2 text-left text-xs font-semibold dark:text-gray-300">Qty</th><th className="px-4 py-2 text-left text-xs font-semibold dark:text-gray-300">Cost</th><th className="px-4 py-2 text-left text-xs font-semibold dark:text-gray-300">Supply</th></tr></thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="border-t dark:border-gray-600"><td className="px-4 py-2 dark:text-gray-100">{item.medicine?.name}</td><td className="px-4 py-2 dark:text-gray-100">{item.quantity}</td><td className="px-4 py-2 dark:text-gray-100">${item.cost_price}</td><td className="px-4 py-2 dark:text-gray-100">${item.supply_price}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-6 border-t dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Close</button>
              {nextStatuses[selectedOrder.status] && (
                <button onClick={() => handleUpdateStatus(selectedOrder.id, nextStatuses[selectedOrder.status])} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Mark as {nextStatuses[selectedOrder.status].replace('_', ' ')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
