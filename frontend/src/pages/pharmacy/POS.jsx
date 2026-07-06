import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, CreditCard, Banknote, Smartphone, Trash2, Plus, Minus, Receipt, Printer } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function POS() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [discount, setDiscount] = useState(0);
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
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.10;
  const total = taxableAmount + tax;

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
        discount: discountAmount,
      });

      setLastSale({
        ...response.data,
        items: [...cart],
        subtotal,
        discount: discountAmount,
        tax,
        total,
        paymentMethod,
      });
      setShowReceipt(true);
      toast.success('Sale completed successfully!');
      setCart([]);
      setDiscount(0);
      loadMedicines();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete sale');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    const receiptContent = `
      <div style="font-family: monospace; width: 300px; padding: 20px;">
        <h2 style="text-align: center; margin: 0;">PharmacyHub</h2>
        <p style="text-align: center; margin: 5px 0; font-size: 12px;">Sale Receipt</p>
        <hr style="margin: 10px 0;">
        <p style="font-size: 12px;">Date: ${new Date().toLocaleString()}</p>
        <p style="font-size: 12px;">Payment: ${lastSale.paymentMethod.toUpperCase()}</p>
        <hr style="margin: 10px 0;">
        ${lastSale.items.map(item => `
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin: 5px 0;">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
        <hr style="margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <span>Subtotal:</span><span>$${lastSale.subtotal.toFixed(2)}</span>
        </div>
        ${lastSale.discount > 0 ? `<div style="display: flex; justify-content: space-between; font-size: 12px;">
          <span>Discount:</span><span>-$${lastSale.discount.toFixed(2)}</span>
        </div>` : ''}
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <span>Tax (10%):</span><span>$${lastSale.tax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-top: 10px;">
          <span>TOTAL:</span><span>$${lastSale.total.toFixed(2)}</span>
        </div>
        <hr style="margin: 10px 0;">
        <p style="text-align: center; font-size: 11px; color: #666;">Thank you for your purchase!</p>
      </div>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
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
            <button type="submit" className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700">Search</button>
          </form>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {medicines.map((medicine) => {
              const stock = medicine.stocks?.[0];
              const isInStock = stock && stock.quantity > 0;
              const cartItem = cart.find(item => item.id === medicine.id);

              return (
                <div
                  key={medicine.id}
                  className={`bg-white p-4 rounded-lg shadow cursor-pointer transition-all ${isInStock ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-50 cursor-not--allowed'}`}
                  onClick={() => isInStock && addToCart(medicine)}
                >
                  <div className="text-xs text-gray-500 mb-1">{medicine.brand}</div>
                  <div className="font-semibold text-sm mb-2 line-clamp-2">{medicine.name}</div>
                  <div className="text-green-600 font-bold text-lg">${stock?.selling_price || medicine.unit_price}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${isInStock ? 'text-gray-500' : 'text-red-500'}`}>
                      {isInStock ? `${stock.quantity} in stock` : 'Out of stock'}
                    </span>
                    {cartItem && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        {cartItem.quantity} in cart
                      </span>
                    )}
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
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
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
          {/* Discount */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              placeholder="Discount %"
              value={discount}
              onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-24 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <span className="text-sm text-gray-500">% discount</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({discount}%):</span><span>-${discountAmount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-gray-600"><span>Tax (10%):</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t"><span>Total:</span><span>${total.toFixed(2)}</span></div>
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
            className="w-full bg-green-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Sale Complete!</h2>
              <button onClick={() => setShowReceipt(false)} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold">Order #{lastSale.order_number || 'POS-' + Date.now()}</p>
                <p className="text-gray-500">{new Date().toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {lastSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${lastSale.subtotal.toFixed(2)}</span></div>
                {lastSale.discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount:</span><span>-${lastSale.discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-sm"><span>Tax:</span><span>${lastSale.tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${lastSale.total.toFixed(2)}</span></div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">Payment: {lastSale.paymentMethod.toUpperCase()}</p>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button onClick={printReceipt} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <Printer className="h-5 w-5" />
                Print Receipt
              </button>
              <button onClick={() => setShowReceipt(false)} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
