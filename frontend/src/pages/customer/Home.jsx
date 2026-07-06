import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Package, Shield, Truck, Clock } from 'lucide-react';
import api from '../../services/api';

export default function Home() {
  const [featuredPharmacies, setFeaturedPharmacies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularMedicines, setPopularMedicines] = useState([]);
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
    if (query) navigate(`/search?q=${query}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-green-700 to-blue-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Medicines <span className="text-green-300">Near You</span>
          </h1>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Search from hundreds of pharmacies and get your medicines delivered to your doorstep
          </p>
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden">
              <input
                type="text"
                name="search"
                placeholder="Search for medicines, health products..."
                className="flex-1 px-6 py-4 text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-4 font-semibold hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </form>
          <div className="flex justify-center gap-4 mt-6 text-sm text-green-100">
            <span>Popular:</span>
            {['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Cetirizine'].map((term) => (
              <button key={term} onClick={() => navigate(`/search?q=${term}`)} className="hover:text-white underline">
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Genuine Medicines', desc: '100% authentic products' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Within 24 hours' },
              { icon: Clock, title: '24/7 Support', desc: 'Always here to help' },
              { icon: MapPin, title: 'Find Nearby', desc: 'Locate pharmacies near you' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex items-center gap-3 p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Browse by Category</h2>
            <Link to="/search" className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/search?category=${category.id}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center group"
              >
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                  <Package className="h-7 w-7 text-green-600" />
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
            <h2 className="text-2xl font-bold text-gray-800">Featured Pharmacies</h2>
            <Link to="/search" className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPharmacies.map((pharmacy) => (
              <div key={pharmacy.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 relative">
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">{pharmacy.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin className="h-4 w-4" />
                    {pharmacy.city}, {pharmacy.state}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{pharmacy.rating || '4.5'}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">{pharmacy.reviews_count || 0} reviews</span>
                  </div>
                  <Link
                    to={`/pharmacy/${pharmacy.subdomain}`}
                    className="mt-4 block text-center bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Search Medicine', desc: 'Find the medicine you need from nearby pharmacies', color: 'green' },
              { icon: MapPin, title: 'Choose Pharmacy', desc: 'Compare prices and select the best pharmacy', color: 'blue' },
              { icon: Package, title: 'Get Delivered', desc: 'Receive your medicines at your doorstep', color: 'purple' },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="text-center">
                  <div className={`w-16 h-16 bg-${step.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 text-${step.color}-600`} />
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold text-gray-600">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Own a Pharmacy?</h2>
          <p className="text-green-100 mb-6 max-w-xl mx-auto">
            Join our platform and reach thousands of customers. Manage your inventory, orders, and grow your business.
          </p>
          <Link
            to="/register-pharmacy"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors"
          >
            Register Your Pharmacy
          </Link>
        </div>
      </section>
    </div>
  );
}
