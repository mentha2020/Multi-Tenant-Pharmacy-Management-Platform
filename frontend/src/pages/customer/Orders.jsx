import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, Eye } from 'lucide-react';
import api from '../../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/customer/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
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

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    preparing: Package,
    ready_for_pickup: Package,
    out_for_delivery: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">No orders yet</p>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
          <Link to="/" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status] || Clock;
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-mono text-sm text-gray-500">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {order.status.replace('_', ' ')}
                    </span>
                    <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Details
                    </button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-4">
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {order.items?.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-shrink-0">
                        <span className="text-lg">💊</span>
                        <div>
                          <p className="text-sm font-medium">{item.medicine?.name}</p>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <span className="text-sm text-gray-500">+{order.items.length - 4} more</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">Pharmacy: <span className="font-medium text-gray-700">{order.pharmacy?.name}</span></span>
                      <span className="text-sm text-gray-500">Payment: <span className="font-medium text-gray-700 capitalize">{order.payment_method}</span></span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-bold text-green-600">${order.total}</p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedOrder?.id === order.id && (
                  <div className="p-4 border-t bg-gray-50">
                    <h3 className="font-semibold mb-3">Order Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-medium capitalize">{order.status.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment</p>
                        <p className="font-medium capitalize">{order.payment_method}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Status</p>
                        <p className="font-medium capitalize">{order.payment_status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Order Type</p>
                        <p className="font-medium capitalize">{order.order_type}</p>
                      </div>
                    </div>
                    {order.shipping_address && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                        <p className="text-sm">{order.shipping_address.name}, {order.shipping_address.address}, {order.shipping_address.city} {order.shipping_address.zip_code}</p>
                      </div>
                    )}
                    <table className="w-full text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="text-left py-2 px-3">Medicine</th>
                          <th className="text-left py-2 px-3">Qty</th>
                          <th className="text-left py-2 px-3">Price</th>
                          <th className="text-left py-2 px-3">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items?.map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-2 px-3">{item.medicine?.name}</td>
                            <td className="py-2 px-3">{item.quantity}</td>
                            <td className="py-2 px-3">${item.price}</td>
                            <td className="py-2 px-3 font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
