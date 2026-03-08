import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
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
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        {/* Placeholder routes for future phases */}
        <Route path="templates" element={<div className="p-8 text-center text-gray-500">Template Gallery - Coming in Phase 2</div>} />
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
      </Route>
    </Routes>
  );
}
