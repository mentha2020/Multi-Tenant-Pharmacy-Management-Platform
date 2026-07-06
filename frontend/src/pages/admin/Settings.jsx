import { useState, useEffect } from 'react';
import { Save, Building2, Mail, Shield } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    site_name: 'PharmaPlatform',
    site_description: 'Multi-tenant pharmacy management platform',
    support_email: 'support@yourplatform.com',
    allow_pharmacy_registration: true,
    require_approval: true,
    maintenance_mode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/super-admin/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/super-admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Platform Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold dark:text-gray-100">General Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Description</label>
              <textarea
                value={settings.site_description}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Registration Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold dark:text-gray-100">Registration Settings</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allow_pharmacy_registration}
                onChange={(e) => setSettings({ ...settings, allow_pharmacy_registration: e.target.checked })}
                className="h-4 w-4 text-green-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Allow pharmacy registration</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.require_approval}
                onChange={(e) => setSettings({ ...settings, require_approval: e.target.checked })}
                className="h-4 w-4 text-green-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Require admin approval for new pharmacies</span>
            </label>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold dark:text-gray-100">System Settings</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                className="h-4 w-4 text-red-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable maintenance mode</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
