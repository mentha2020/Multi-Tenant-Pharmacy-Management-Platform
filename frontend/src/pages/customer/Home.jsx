import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Package } from 'lucide-react';
import api from '../../services/api';

export default function Home() {
  const [featuredPharmacies, setFeaturedPharmacies] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pharmaciesRes, categoriesRes] = await Promise.all([
        api.get('/customer/pharmacies?per_page=6'),
        api.get('/categories'),
      ]);
      setFeaturedPharmacies(pharmaciesRes.data.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Medicines Near You
          </h1>
          <p className="text-xl mb-8 text-green-100">
            Search from hundreds of pharmacies and get your medicines delivered
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex">
              <input
                type="text"
                name="search"
                placeholder="Search for medicines..."
                className="flex-1 px-6 py-4 text-gray-900 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-white text-green-600 px-8 py-4 rounded-r-lg font-semibold hover:bg-green-50 flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/search?category=${category.id}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-800">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pharmacies */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Pharmacies</h2>
            <Link to="/search" className="text-green-600 hover:text-green-700 flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPharmacies.map((pharmacy) => (
              <div key={pharmacy.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-r from-green-400 to-blue-500"></div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{pharmacy.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin className="h-4 w-4" />
                    {pharmacy.city}, {pharmacy.state}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {pharmacy.reviews_count || 0} reviews
                    </span>
                  </div>
                  <Link
                    to={`/pharmacy/${pharmacy.subdomain}`}
                    className="mt-4 block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Search Medicine</h3>
              <p className="text-gray-600">Find the medicine you need from nearby pharmacies</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Choose Pharmacy</h3>
              <p className="text-gray-600">Compare prices and select the best pharmacy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Get Delivered</h3>
              <p className="text-gray-600">Receive your medicines at your doorstep</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
