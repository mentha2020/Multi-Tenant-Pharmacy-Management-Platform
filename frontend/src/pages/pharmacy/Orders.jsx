import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, X, Truck, Package } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '' });

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pharmacy/orders', { params: filters });
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/pharmacy/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      loadOrders();
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready_for_pickup: 'bg-green-100 text-green-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const nextStatuses = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'ready_for_pickup',
    ready_for_pickup: 'out_for_delivery',
    out_for_delivery: 'delivered',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input type="text" placeholder="Search orders..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready_for_pickup">Ready for Pickup</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="7" className="px-6 py-12 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div></td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No orders found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{order.order_number}</td>
                  <td className="px-6 py-4">{order.customer?.name || 'Guest'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${order.order_type === 'pos' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {order.order_type === 'pos' ? 'POS' : 'Online'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.items?.length || 0} items</td>
                  <td className="px-6 py-4 font-bold text-green-600">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="h-4 w-4" /></button>
                      {nextStatuses[order.status] && (
                        <button onClick={() => updateStatus(order.id, nextStatuses[order.status])} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title={`Mark as ${nextStatuses[order.status].replace('_', ' ')}`}>
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button onClick={() => updateStatus(order.id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Cancel Order">
                          <XCircle className="h-4 w-4" />
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
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Order #{selectedOrder.order_number}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Customer</p><p className="font-medium">{selectedOrder.customer?.name || 'Guest'}</p></div>
                <div><p className="text-sm text-gray-500">Order Type</p><span className={`px-2 py-1 rounded text-xs font-medium ${selectedOrder.order_type === 'pos' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{selectedOrder.order_type === 'pos' ? 'POS' : 'Online'}</span></div>
                <div><p className="text-sm text-gray-500">Payment</p><p className="font-medium capitalize">{selectedOrder.payment_method}</p></div>
                <div><p className="text-sm text-gray-500">Payment Status</p><span className={`px-2 py-1 rounded text-xs font-medium ${selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedOrder.payment_status}</span></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <table className="w-full border rounded-lg">
                  <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-semibold">Medicine</th><th className="px-4 py-2 text-left text-xs font-semibold">Qty</th><th className="px-4 py-2 text-left text-xs font-semibold">Price</th><th className="px-4 py-2 text-left text-xs font-semibold">Total</th></tr></thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="border-t"><td className="px-4 py-2">{item.medicine?.name}</td><td className="px-4 py-2">{item.quantity}</td><td className="px-4 py-2">${item.price}</td><td className="px-4 py-2 font-medium">${(item.price * item.quantity).toFixed(2)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div><p className="text-sm text-gray-500">Subtotal</p><p className="font-medium">${selectedOrder.subtotal}</p></div>
                <div><p className="text-sm text-gray-500">Tax</p><p className="font-medium">${selectedOrder.tax}</p></div>
                <div><p className="text-sm text-gray-500">Total</p><p className="font-bold text-green-600 text-lg">${selectedOrder.total}</p></div>
              </div>
              {selectedOrder.notes && (<div><p className="text-sm text-gray-500">Notes</p><p className="bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p></div>)}
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Close</button>
              {nextStatuses[selectedOrder.status] && (
                <button onClick={() => updateStatus(selectedOrder.id, nextStatuses[selectedOrder.status])} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
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
