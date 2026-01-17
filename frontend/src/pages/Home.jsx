import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Wellness Marketplace</h1>
          <p className="text-xl mb-8">Connect with verified alternative therapy practitioners</p>
          <div className="space-x-4">
            {!user && (
              <>
                <Link to="/register" className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition">
                  Get Started
                </Link>
                <Link to="/practitioners" className="bg-teal-700 px-8 py-3 rounded-lg font-semibold hover:bg-teal-800 transition">
                  Find Practitioners
                </Link>
              </>
            )}
            {user && (
              <Link to="/dashboard" className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="text-xl font-bold mb-2">Book Therapy Sessions</h3>
              <p className="text-gray-600">Connect with verified practitioners in physiotherapy, acupuncture, Ayurveda, and more</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-bold mb-2">Wellness Products</h3>
              <p className="text-gray-600">Shop for wellness tools, supplements, and alternative therapy products</p>
            </div>
            <div className="text-center p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Community Forum</h3>
              <p className="text-gray-600">Ask questions and get expert advice from practitioners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Therapy Specializations</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {['Physiotherapy', 'Acupuncture', 'Ayurveda', 'Chiropractic'].map(spec => (
              <div key={spec} className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
                <h3 className="font-bold text-lg">{spec}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
