import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            🌿 Wellness Marketplace
          </Link>
          
          <div className="flex space-x-6 items-center">
            <Link to="/" className="hover:text-teal-200 transition">Home</Link>
            <Link to="/practitioners" className="hover:text-teal-200 transition">Practitioners</Link>
            <Link to="/products" className="hover:text-teal-200 transition">Products</Link>
            <Link to="/community" className="hover:text-teal-200 transition">Community</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-teal-200 transition">Dashboard</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/verify-practitioners" className="hover:text-teal-200 transition font-semibold">
                      Verify Practitioners
                    </Link>
                    <Link to="/admin/manage-stock" className="hover:text-teal-200 transition font-semibold">
                      Manage Stock
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-3 border-l pl-6">
                  <span className="text-sm font-semibold">👤 {user.name}</span>
                  <button onClick={logout} className="hover:text-teal-200 transition">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-teal-200 transition">Login</Link>
                <Link to="/register" className="bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
