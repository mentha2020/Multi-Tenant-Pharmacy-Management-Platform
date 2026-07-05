import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Star, Filter, List, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    inStock: true,
    sortBy: 'relevance',
    radius: 10,
  });

  useEffect(() => {
    if (query) {
      searchMedicines();
    }
  }, [query, filters]);

  const searchMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.get('/customer/medicines/search', {
        params: { q: query, ...filters },
      });
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Search results for "{query}"
          </h1>
          <p className="text-gray-600">
            Found in {results.length} pharmacies
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            <Map className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Filters:</span>
          </div>

          <select
            value={filters.radius}
            onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
              className="rounded text-green-600"
            />
            In Stock Only
          </label>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No results found for "{query}"</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  {result.medicine.image ? (
                    <img src={result.medicine.image} alt={result.medicine.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">💊</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{result.medicine.name}</h3>
                  <p className="text-gray-500 text-sm">{result.medicine.generic_name}</p>
                  {result.medicine.brand && (
                    <p className="text-gray-400 text-sm">Brand: {result.medicine.brand}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-bold text-xl">${result.price}</p>
                  {result.medicine.requires_prescription && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Rx Only</span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    to={`/pharmacy/${result.pharmacy.subdomain}`}
                    className="flex items-center gap-1 text-gray-600 hover:text-green-600"
                  >
                    <MapPin className="h-4 w-4" />
                    {result.pharmacy.name}
                  </Link>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500 text-sm">{result.pharmacy.city}</span>
                </div>
                <Link
                  to={`/pharmacy/${result.pharmacy.subdomain}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapContainer
            center={[28.6139, 77.2090]} // Default center (Delhi)
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {results.map((result, index) => (
              result.pharmacy.latitude && result.pharmacy.longitude && (
                <Marker
                  key={index}
                  position={[result.pharmacy.latitude, result.pharmacy.longitude]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold">{result.pharmacy.name}</h3>
                      <p className="text-sm text-gray-600">{result.medicine.name}</p>
                      <p className="text-green-600 font-semibold">${result.price}</p>
                      <Link
                        to={`/pharmacy/${result.pharmacy.subdomain}`}
                        className="block mt-2 text-center bg-green-600 text-white py-1 rounded"
                      >
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
