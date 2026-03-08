import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TemplateGallery from './pages/TemplateGallery';
import TemplateDetail from './pages/TemplateDetail';
import AdminDashboard from './pages/admin/Dashboard';
import ManageTemplates from './pages/admin/ManageTemplates';

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

        {/* Protected routes */}
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <div className="p-8 text-center text-gray-500">Cart - Coming in Phase 4</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/*"
          element={
            <ProtectedRoute>
              <div className="p-8 text-center text-gray-500">Dashboard - Coming in Phase 5</div>
            </ProtectedRoute>
          }
        />

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
          element={
            <AdminRoute>
              <div className="p-8 text-center text-gray-500">Order Management - Coming in Phase 5</div>
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}
