import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Smartphone, Lock, CheckCircle } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, pharmacy, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '', phone: '', address: '', city: '', zip_code: '',
  });

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const tax = subtotal * 0.10;
  const totalAmount = subtotal + deliveryFee + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        pharmacy_id: pharmacy?.id,
        items: items.map(item => ({
          medicine_id: item.id,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
      };

      const response = await api.post('/customer/orders', orderData);

      if (response.data.order) {
        clearCart();
        setOrderPlaced(true);
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h1>
          <p className="text-gray-600 mb-6">Your order has been placed successfully. You will receive a confirmation shortly.</p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/orders')} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
              View Orders
            </button>
            <button onClick={() => navigate('/')} className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" required value={shippingAddress.name} onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })} className="w-full border dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" placeholder="John Doe" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input type="tel" required value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} className="w-full border dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" placeholder="+1 234 567 890" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <textarea required value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className="w-full border dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" rows={3} placeholder="Street address, apartment, suite, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input type="text" required value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="w-full border dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                  <input type="text" required value={shippingAddress.zip_code} onChange={(e) => setShippingAddress({ ...shippingAddress, zip_code: e.target.value })} className="w-full border dark:border-gray-600 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { method: 'cash', icon: Banknote, label: 'Cash on Delivery', desc: 'Pay when you receive your order', color: 'green' },
                  { method: 'card', icon: CreditCard, label: 'Credit/Debit Card', desc: 'Pay securely with your card', color: 'blue' },
                  { method: 'mobile', icon: Smartphone, label: 'Mobile Payment', desc: 'Pay via mobile wallet', color: 'purple' },
                ].map(({ method, icon: Icon, label, desc, color }) => (
                  <label key={method} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/30` : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                    <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="text-green-600" />
                    <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 text-${color}-600`} />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{label}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-fit sticky top-24">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-60 overflow-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💊</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" disabled={loading || items.length === 0} className="w-full bg-green-600 text-white py-3.5 rounded-lg font-bold mt-6 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Secure checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
