import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Package, ShoppingCart, Truck, BarChart3, Settings, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const sidebarItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/pharmacies', label: 'Pharmacies', icon: Building2 },
  { path: '/admin/medicines', label: 'Medicines', icon: Package },
  { path: '/admin/supply-orders', label: 'Supply Orders', icon: Truck },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 text-white flex flex-col z-50 overflow-hidden">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-xl">P</span>
            </div>
            <div className="min-w-0">
              <span className="text-lg font-bold block">PharmacyHub</span>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</p>
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800"
            >
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-medium">{user?.name?.charAt(0)}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>

            {showDropdown && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen bg-gray-100 overflow-x-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-800 truncate">Welcome back, {user?.name}</h1>
              <p className="text-sm text-gray-500">Here's what's happening with your platform</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link to="/" className="text-sm text-gray-600 hover:text-green-600 whitespace-nowrap">
                View Website
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}
