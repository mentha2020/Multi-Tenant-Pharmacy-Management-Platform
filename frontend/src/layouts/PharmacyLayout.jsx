import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, ShoppingCart, CreditCard, Settings, LogOut, ChevronDown, Bell, AlertTriangle, Truck, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const sidebarItems = [
  { path: '/pharmacy/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pharmacy/medicines', label: 'Medicines', icon: Package },
  { path: '/pharmacy/stock', label: 'Stock', icon: Warehouse },
  { path: '/pharmacy/low-stock', label: 'Low Stock', icon: AlertTriangle },
  { path: '/pharmacy/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/pharmacy/supply-requests', label: 'Supply Requests', icon: Truck },
  { path: '/pharmacy/pos', label: 'POS', icon: CreditCard },
  { path: '/pharmacy/settings', label: 'Settings', icon: Settings },
];

export default function PharmacyLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col z-50 overflow-hidden">
        <div className="p-4 border-b border-gray-800 dark:border-gray-700">
          <Link to="/pharmacy/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-xl">P</span>
            </div>
            <div className="min-w-0">
              <span className="text-lg font-bold block">PharmacyHub</span>
              <p className="text-xs text-gray-400 truncate">{user?.pharmacy?.name || 'Pharmacy Panel'}</p>
            </div>
          </Link>
        </div>
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
                        : 'text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white'
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
        <div className="p-4 border-t border-gray-800 dark:border-gray-700">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-medium">{user?.name?.charAt(0)}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-gray-400">Pharmacy Owner</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </button>
            {showDropdown && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-800 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                <Link to="/pharmacy/settings" className="flex items-center gap-2 w-full px-4 py-3 text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white">
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-3 text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white">
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 min-h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">Welcome back, {user?.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.pharmacy?.name}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 whitespace-nowrap">View Website</Link>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}
