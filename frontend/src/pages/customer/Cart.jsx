import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Store } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = items.length > 0 ? 5.00 : 0;
  const tax = subtotal * 0.10;
  const total = subtotal + deliveryFee + tax;

  // Group items by pharmacy
  const itemsByPharmacy = items.reduce((acc, item) => {
    const pharmacyId = item.pharmacy?.id || 'unknown';
    if (!acc[pharmacyId]) {
      acc[pharmacyId] = { pharmacy: item.pharmacy, items: [] };
    }
    acc[pharmacyId].items.push(item);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <ShoppingCart className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Your cart is empty</p>
          <p className="text-gray-400 dark:text-gray-500 mb-6">Start adding medicines from your favorite pharmacies</p>
          <button onClick={() => navigate('/')} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(itemsByPharmacy).map(([pharmacyId, { pharmacy, items: pharmacyItems }]) => (
              <div key={pharmacyId} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600 flex items-center gap-2">
                  <Store className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{pharmacy?.name || 'Unknown Pharmacy'}</span>
                </div>
                {pharmacyItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border-b dark:border-gray-600 last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-2xl">💊</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{item.brand}</p>
                      <p className="text-green-600 dark:text-green-400 font-bold mt-1">${item.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-9 h-9 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-9 h-9 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="font-bold text-gray-800 dark:text-gray-100">${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 mt-1 text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                Continue Shopping
              </button>
              <button onClick={clearCart} className="text-red-500 hover:text-red-600 text-sm font-medium">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(user ? '/checkout' : '/login')}
              className="w-full bg-green-600 text-white py-3.5 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            {!user && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                <Link to="/login" className="text-green-600 hover:underline">Login</Link> or{' '}
                <Link to="/register" className="text-green-600 hover:underline">Register</Link> to checkout
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
