import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Warehouse, ShoppingCart, CreditCard, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

const sidebarItems = [
  { path: '/pharmacy/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pharmacy/medicines', label: 'Medicines', icon: Package },
  { path: '/pharmacy/stock', label: 'Stock', icon: Warehouse },
  { path: '/pharmacy/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/pharmacy/pos', label: 'POS', icon: CreditCard },
  { path: '/pharmacy/settings', label: 'Settings', icon: Settings },
];

export default function PharmacyLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link to="/pharmacy/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-xl">P</span>
            </div>
            <span className="text-lg font-bold">Pharmacy</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
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
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="font-medium">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.pharmacy?.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
