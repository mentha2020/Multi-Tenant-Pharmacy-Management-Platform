import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, CreditCard, Banknote, Smartphone, Trash2, Plus, Minus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function POS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await api.get('/pharmacy/medicines', {
        params: { search: searchQuery, per_page: 50 }
      });
      setMedicines(response.data.data || []);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadMedicines();
  };

  const addToCart = (medicine) => {
    const stock = medicine.stocks?.[0];
    if (!stock || stock.quantity <= 0) {
      toast.error('Out of stock');
      return;
    }

    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      if (existingItem.quantity >= stock.quantity) {
        toast.error('Insufficient stock');
        return;
      }
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: medicine.id,
        name: medicine.name,
        brand: medicine.brand,
        price: stock.selling_price,
        quantity: 1,
        maxQuantity: stock.quantity,
      }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
        : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/pharmacy/pos/sale', {
        items: cart.map(item => ({
          medicine_id: item.id,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
      });

      toast.success('Sale completed successfully!');
      setCart([]);
      loadMedicines(); // Refresh stock
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3rem)] flex bg-gray-100">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 bg-white shadow">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search medicine or scan barcode..."
                className="w-full text-lg p-3 border-2 rounded-lg focus:outline-none focus:border-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {medicines.map((medicine) => {
              const stock = medicine.stocks?.[0];
              const isInStock = stock && stock.quantity > 0;

              return (
                <div
                  key={medicine.id}
                  className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-all ${isInStock ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={() => isInStock && addToCart(medicine)}
                >
                  <div className="text-xs text-gray-500 mb-1">{medicine.brand}</div>
                  <div className="font-semibold text-sm mb-2 line-clamp-2">{medicine.name}</div>
                  <div className="text-green-600 font-bold text-lg">
                    ${stock?.selling_price || medicine.unit_price}
                  </div>
                  <div className={`text-xs mt-1 ${isInStock ? 'text-gray-500' : 'text-red-500'}`}>
                    {isInStock ? `${stock.quantity} in stock` : 'Out of stock'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-96 bg-white shadow-lg flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b flex items-center gap-2 bg-green-600 text-white">
          <ShoppingCart className="h-6 w-6" />
          <h2 className="text-xl font-bold">Cart ({cart.length})</h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Cart is empty</p>
              <p className="text-sm">Click on items to add them</p>
            </div>
          ) : (
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.brand}</div>
                      <div className="text-green-600">${item.price}</div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="ml-auto font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="border-t p-4 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex gap-2 mb-4">
            {[
              { method: 'cash', icon: Banknote, label: 'Cash' },
              { method: 'card', icon: CreditCard, label: 'Card' },
              { method: 'mobile', icon: Smartphone, label: 'Mobile' },
            ].map(({ method, icon: Icon, label }) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 border-2 transition-colors ${
                  paymentMethod === method
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-500'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={loading || cart.length === 0}
            className="w-full bg-green-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
