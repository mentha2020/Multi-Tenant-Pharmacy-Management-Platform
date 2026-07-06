import { useState, useEffect } from 'react';
import { Building2, Search, CheckCircle, XCircle, Eye, MapPin, Phone, Mail, Plus, Filter } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Pharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subdomain: '',
    owner_id: '',
    license_no: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    description: '',
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadPharmacies();
  }, [filters]);

  const loadPharmacies = async () => {
    setLoading(true);
    try {
      const response = await api.get('/super-admin/pharmacies', { params: filters });
      setPharmacies(response.data.data);
      setPagination(response.data);
    } catch (error) {
      console.error('Error loading pharmacies:', error);
      toast.error('Failed to load pharmacies');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/super-admin/pharmacies', { params: { per_page: 100 } });
      setUsers(response.data.data || []);
    } catch (error) {
      // silent
    }
  };

  const handleNameChange = (value) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setFormData({ ...formData, name: value, slug, subdomain: slug });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await api.post('/super-admin/pharmacies', formData);
      toast.success('Pharmacy created successfully');
      setShowAddModal(false);
      setFormData({ name: '', slug: '', subdomain: '', owner_id: '', license_no: '', phone: '', email: '', address: '', city: '', state: '', zip_code: '', description: '' });
      loadPharmacies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create pharmacy');
    } finally {
      setAddLoading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await api.patch(`/super-admin/pharmacies/${id}/activate`);
      toast.success('Pharmacy activated successfully');
      loadPharmacies();
    } catch (error) {
      toast.error('Failed to activate pharmacy');
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Are you sure you want to deactivate this pharmacy?')) return;
    try {
      await api.patch(`/super-admin/pharmacies/${id}/deactivate`);
      toast.success('Pharmacy deactivated successfully');
      loadPharmacies();
    } catch (error) {
      toast.error('Failed to deactivate pharmacy');
    }
  };

  const handleView = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Pharmacies</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{pagination.total || 0} pharmacies total</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); loadUsers(); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Pharmacy
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pharmacies..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pharmacy</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </td>
              </tr>
            ) : pharmacies.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No pharmacies found</p>
                </td>
              </tr>
            ) : (
              pharmacies.map((pharmacy) => (
                <tr key={pharmacy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{pharmacy.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{pharmacy.subdomain}.yourplatform.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{pharmacy.owner?.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{pharmacy.owner?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {pharmacy.city}, {pharmacy.state}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      <Phone className="h-4 w-4 text-gray-400 mr-1" />
                      {pharmacy.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${pharmacy.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                      {pharmacy.is_active ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(pharmacy)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {pharmacy.is_active ? (
                        <button
                          onClick={() => handleDeactivate(pharmacy.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Deactivate"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(pharmacy.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Activate"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {pagination.from} to {pagination.to} of {pagination.total} pharmacies
            </div>
            <div className="flex gap-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilters({ ...filters, page })}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${filters.page === page ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Pharmacy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-gray-100">Add New Pharmacy</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pharmacy Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Health Plus Pharmacy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="health-plus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subdomain *</label>
                  <div className="flex">
                    <input
                      type="text"
                      required
                      value={formData.subdomain}
                      onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                      className="w-full border rounded-l-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      placeholder="health-plus"
                    />
                    <span className="bg-gray-100 border border-l-0 rounded-r-lg px-3 py-2.5 text-gray-500 dark:bg-gray-600 dark:text-gray-300 text-sm">.yourplatform.com</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License No *</label>
                  <input
                    type="text"
                    required
                    value={formData.license_no}
                    onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="PH-12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="pharmacy@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="10001"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    rows={3}
                    placeholder="Pharmacy description..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
                >
                  {addLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {addLoading ? 'Creating...' : 'Create Pharmacy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pharmacy Detail Modal */}
      {showModal && selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-gray-100">{selectedPharmacy.name}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">License No</p>
                  <p className="font-medium dark:text-gray-100">{selectedPharmacy.license_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subdomain</p>
                  <p className="font-medium dark:text-gray-100">{selectedPharmacy.subdomain}.yourplatform.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium dark:text-gray-100">{selectedPharmacy.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium dark:text-gray-100">{selectedPharmacy.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium dark:text-gray-100">{selectedPharmacy.address}, {selectedPharmacy.city}, {selectedPharmacy.state} {selectedPharmacy.zip_code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                  <p className="font-medium dark:text-gray-100">{selectedPharmacy.owner?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedPharmacy.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                    {selectedPharmacy.is_active ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
              {selectedPharmacy.description && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="font-medium dark:text-gray-100">{selectedPharmacy.description}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                Close
              </button>
              {!selectedPharmacy.is_active && (
                <button
                  onClick={() => { handleActivate(selectedPharmacy.id); setShowModal(false); }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Activate Pharmacy
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
