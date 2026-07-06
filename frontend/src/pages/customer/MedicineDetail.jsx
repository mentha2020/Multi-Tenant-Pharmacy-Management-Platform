import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, ShoppingCart, Plus, Minus, ArrowLeft, Info, Shield } from 'lucide-react';
import api from '../../services/api';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function MedicineDetail() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadMedicine();
  }, [id]);

  const loadMedicine = async () => {
    try {
      const response = await api.get(`/customer/medicines/${id}`);
      setMedicine(response.data);
    } catch (error) {
      console.error('Error loading medicine:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!medicine) return;
    const stock = medicine.stocks?.[0];
    addItem({
      id: medicine.id,
      name: medicine.name,
      brand: medicine.brand,
      price: stock?.selling_price || medicine.unit_price,
      image: medicine.image,
      pharmacy: stock?.pharmacy,
      quantity,
    });
    toast.success(`Added ${quantity} item(s) to cart`);
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">Medicine not found</p>
        <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  const stock = medicine.stocks?.[0];
  const isInStock = stock && stock.quantity > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6">
        <ArrowLeft className="h-5 w-5" />
        Back to Home
      </Link>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="bg-gray-50 p-8 flex items-center justify-center">
            <div className="w-80 h-80 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              {medicine.image ? (
                <img src={medicine.image} alt={medicine.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-8xl">💊</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">{medicine.brand}</span>
              {medicine.requires_prescription && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-medium">Rx Only</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">{medicine.name}</h1>
            <p className="text-gray-500 mb-4">{medicine.generic_name}</p>

            {medicine.category && (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full mb-4">
                {medicine.category.name}
              </span>
            )}

            <div className="mb-6">
              <p className="text-3xl font-bold text-green-600">${stock?.selling_price || medicine.unit_price}</p>
              {stock && (
                <p className={`text-sm mt-1 ${isInStock ? 'text-green-600' : 'text-red-500'}`}>
                  {isInStock ? `${stock.quantity} in stock` : 'Out of stock'}
                </p>
              )}
            </div>

            {medicine.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{medicine.description}</p>
              </div>
            )}

            {medicine.manufacturer && (
              <div className="mb-6">
                <p className="text-sm text-gray-500">Manufacturer</p>
                <p className="font-medium">{medicine.manufacturer}</p>
              </div>
            )}

            {/* Pharmacy Info */}
            {stock?.pharmacy && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Available at</h3>
                <Link to={`/pharmacy/${stock.pharmacy.subdomain}`} className="flex items-center gap-2 text-green-600 hover:text-green-700">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{stock.pharmacy.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{stock.pharmacy.city}</span>
                </Link>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            {isInStock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-50">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-3 font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(stock.quantity, quantity + 1))} className="px-4 py-3 hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={handleAddToCart} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Genuine Medicine</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Verified Pharmacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
