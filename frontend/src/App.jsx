import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Practitioners from './pages/Practitioners';
import Products from './pages/Products';
import Community from './pages/Community';
import BookSession from './pages/BookSession';
import AdminVerifyPractitioners from './pages/AdminVerifyPractitioners';
import AdminManageStock from './pages/AdminManageStock';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/practitioners" element={<Practitioners />} />
          <Route path="/products" element={<Products />} />
          <Route path="/community" element={<Community />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/book-session/:practitionerId" element={<ProtectedRoute><BookSession /></ProtectedRoute>} />
          <Route path="/admin/verify-practitioners" element={<AdminRoute><AdminVerifyPractitioners /></AdminRoute>} />
          <Route path="/admin/manage-stock" element={<AdminRoute><AdminManageStock /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
