import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import PharmacyLayout from './layouts/PharmacyLayout';

// Customer Pages
import Home from './pages/customer/Home';
import Search from './pages/customer/Search';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import ForgotPassword from './pages/customer/ForgotPassword';
import ResetPassword from './pages/customer/ResetPassword';
import RegisterPharmacy from './pages/customer/RegisterPharmacy';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminPharmacies from './pages/admin/Pharmacies';
import AdminMedicines from './pages/admin/Medicines';
import AdminSupplyOrders from './pages/admin/SupplyOrders';
import AdminReports from './pages/admin/Reports';

// Pharmacy Pages
import PharmacyDashboard from './pages/pharmacy/Dashboard';
import PharmacyMedicines from './pages/pharmacy/Medicines';
import PharmacyStock from './pages/pharmacy/Stock';
import PharmacyOrders from './pages/pharmacy/Orders';
import POS from './pages/pharmacy/POS';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

// Public Route (redirect if logged in)
function PublicRoute({ children }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    if (user.role === 'pharmacy_owner' || user.role === 'pharmacy_staff') {
      return <Navigate to="/pharmacy/dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return children;
}

const queryClient = new QueryClient();

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="register-pharmacy" element={<RegisterPharmacy />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<ProtectedRoute allowedRoles={['customer']}><Checkout /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="pharmacies" element={<AdminPharmacies />} />
            <Route path="medicines" element={<AdminMedicines />} />
            <Route path="supply-orders" element={<AdminSupplyOrders />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Pharmacy Routes */}
          <Route path="/pharmacy" element={
            <ProtectedRoute allowedRoles={['pharmacy_owner', 'pharmacy_staff']}>
              <PharmacyLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<PharmacyDashboard />} />
            <Route path="medicines" element={<PharmacyMedicines />} />
            <Route path="stock" element={<PharmacyStock />} />
            <Route path="orders" element={<PharmacyOrders />} />
            <Route path="pos" element={<POS />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
