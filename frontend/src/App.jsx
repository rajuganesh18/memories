import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TemplateGallery from './pages/TemplateGallery';
import TemplateDetail from './pages/TemplateDetail';
import AlbumBuilder from './pages/AlbumBuilder';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Orders from './pages/dashboard/Orders';
import OrderDetail from './pages/dashboard/OrderDetail';
import Addresses from './pages/dashboard/Addresses';
import Profile from './pages/dashboard/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import ManageTemplates from './pages/admin/ManageTemplates';
import ManageOrders from './pages/admin/ManageOrders';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!user.is_admin) return <Navigate to="/" />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (user) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="login"
          element={<GuestRoute><Login /></GuestRoute>}
        />
        <Route
          path="register"
          element={<GuestRoute><Register /></GuestRoute>}
        />

        {/* Templates */}
        <Route path="templates" element={<TemplateGallery />} />
        <Route path="templates/:id" element={<TemplateDetail />} />

        {/* Album builder */}
        <Route
          path="albums/create"
          element={<ProtectedRoute><AlbumBuilder /></ProtectedRoute>}
        />

        {/* Cart & Checkout */}
        <Route
          path="cart"
          element={<ProtectedRoute><Cart /></ProtectedRoute>}
        />
        <Route
          path="checkout"
          element={<ProtectedRoute><Checkout /></ProtectedRoute>}
        />
        <Route
          path="order-confirmation/:orderId"
          element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>}
        />

        {/* User Dashboard */}
        <Route
          path="dashboard"
          element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
        >
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetail />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="admin"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />
        <Route
          path="admin/templates"
          element={<AdminRoute><ManageTemplates /></AdminRoute>}
        />
        <Route
          path="admin/orders"
          element={<AdminRoute><ManageOrders /></AdminRoute>}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
