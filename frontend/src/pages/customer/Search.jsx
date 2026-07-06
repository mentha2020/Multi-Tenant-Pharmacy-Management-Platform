import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Star, Filter, List, Map, ShoppingCart, Plus } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const [results, setResults] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ inStock: true, sortBy: 'relevance', radius: 10 });
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    searchMedicines();
  }, [query, category, filters]);

  const searchMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.get('/customer/medicines/search', {
        params: { q: query, category, ...filters },
      });
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (result) => {
    addItem({
      id: result.medicine.id,
      name: result.medicine.name,
      brand: result.medicine.brand,
      price: result.price,
      image: result.medicine.image,
      pharmacy: result.pharmacy,
      quantity: 1,
    });
    toast.success('Added to cart');
  };

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {query ? `Search results for "${query}"` : 'All Medicines'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Found in {results.length} pharmacies</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            <List className="h-5 w-5" />
          </button>
          <button onClick={() => setViewMode('map')} className={`p-2.5 rounded-lg ${viewMode === 'map' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            <Map className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filters:</span>
          </div>
          <select value={filters.radius} onChange={(e) => setFilters({ ...filters, radius: e.target.value })} className="border dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:text-white">
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={filters.inStock} onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })} className="rounded text-green-600 dark:text-green-400" />
            <span className="text-sm dark:text-gray-300">In Stock Only</span>
          </label>
          <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className="border dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:text-white">
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <SearchIcon className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">No results found for "{query}"</p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">Try different keywords or browse categories</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  {result.medicine.image ? (
                    <img src={result.medicine.image} alt={result.medicine.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-3xl">💊</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/medicine/${result.medicine.id}`} className="font-bold text-lg text-gray-800 dark:text-gray-100 hover:text-green-600 transition-colors">
                        {result.medicine.name}
                      </Link>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{result.medicine.generic_name}</p>
                      {result.medicine.brand && <p className="text-gray-400 dark:text-gray-500 text-sm">Brand: {result.medicine.brand}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-bold text-2xl">${result.price}</p>
                      {result.medicine.requires_prescription && (
                        <span className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-1 rounded-full font-medium">Rx Only</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link to={`/pharmacy/${result.pharmacy.subdomain}`} className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-green-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{result.pharmacy.name}</span>
                  </Link>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{result.pharmacy.city}</span>
                  {result.in_stock !== false && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <span className="text-green-600 text-sm font-medium">In Stock</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(result)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[600px] rounded-xl overflow-hidden shadow-sm">
          <MapContainer center={[28.6139, 77.2090]} zoom={12} className="h-full w-full">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {results.map((result, index) => (
              result.pharmacy.latitude && result.pharmacy.longitude && (
                <Marker key={index} position={[result.pharmacy.latitude, result.pharmacy.longitude]}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold">{result.pharmacy.name}</h3>
                      <p className="text-sm text-gray-600">{result.medicine.name}</p>
                      <p className="text-green-600 font-semibold text-lg">${result.price}</p>
                      <Link to={`/pharmacy/${result.pharmacy.subdomain}`} className="block mt-2 text-center bg-green-600 text-white py-1.5 rounded-lg text-sm">
                        Visit Store
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
