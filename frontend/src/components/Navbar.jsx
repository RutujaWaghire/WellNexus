import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "sessions": []}');
      const total = cart.products.length + cart.sessions.length;
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdate', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdate', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="gradient-header shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              <span className="text-3xl">🌿</span>
              <span>Wellness Marketplace</span>
            </Link>
            
            <div className="flex space-x-6 items-center">
              <Link to="/" className="hover:text-green-100 transition font-medium">Home</Link>
              <Link to="/practitioners" className="hover:text-green-100 transition font-medium">Practitioners</Link>
              <Link to="/products" className="hover:text-green-100 transition font-medium">Products</Link>
              <Link to="/community" className="hover:text-green-100 transition font-medium">Community</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="hover:text-green-100 transition font-medium">Dashboard</Link>
                  <Link to="/analytics" className="hover:text-green-100 transition font-medium">Analytics</Link>
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin/dashboard" className="bg-purple-500/90 px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold flex items-center gap-2">
                        <span>👨‍💼</span>
                        <span>Admin</span>
                      </Link>
                      <Link to="/admin/verify-practitioners" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition font-semibold">
                        ✓ Verify
                      </Link>
                    </>
                  )}
                  
                  {/* 🛒 Cart Icon with Badge */}
                  <Link to="/cart" className="relative hover:scale-110 transition-transform">
                    <span className="text-2xl">🛒</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center pulse-success">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* 🔔 Notification Center */}
                  <NotificationCenter userId={user.id} />

                  <div className="flex items-center space-x-3 border-l border-white/30 pl-6">
                    <span className="text-sm font-semibold">👤 {user.name}</span>
                    <button 
                      onClick={() => setShowLogoutModal(true)} 
                      className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-green-100 transition font-medium">Login</Link>
                  <Link to="/register" className="bg-white text-wellness-green px-5 py-2 rounded-lg hover:bg-green-50 transition font-semibold btn-animated">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 scale-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 btn-primary btn-animated"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
