import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const demoCredentials = [
    { role: '👨‍⚕️ Admin', email: 'admin@wellness.com', password: 'Admin@123' },
    { role: '🧑‍⚕️ Practitioner', email: 'dr.smith@wellness.com', password: 'Pract@123' },
    { role: '🧘 Patient', email: 'patient@wellness.com', password: 'Patient@123' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      }
      addToast('Login successful! Welcome back! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      addToast(errorMsg, 'error');
    }
  };

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
    addToast('Demo credentials loaded. Click Login!', 'info');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-12 px-4 fade-in">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <div className="wellness-card scale-in">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">🌿 Welcome Back</h2>
            <p className="text-gray-600">Login to continue your wellness journey</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded mb-6 slide-down">
              <p className="font-semibold">❌ {error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  className="input-field pr-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-wellness-green border-gray-300 rounded focus:ring-2 focus:ring-wellness-green"
                />
                <span className="text-gray-700 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-sm text-wellness-green hover:underline">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary btn-animated"
            >
              Login
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-wellness-green hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Credentials Panel */}
        <div className="space-y-6 slide-up">
          <div className="wellness-card bg-gradient-to-br from-green-50 to-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎯</span> Demo Credentials
            </h3>
            <p className="text-gray-600 mb-6">
              Click any credential below to auto-fill and test the platform
            </p>

            <div className="space-y-3">
              {demoCredentials.map((cred, index) => (
                <div
                  key={index}
                  onClick={() => handleDemoLogin(cred.email, cred.password)}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-wellness-green hover:bg-green-50 cursor-pointer transition-all btn-animated group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-wellness-green transition">
                        {cred.role}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{cred.email}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">{cred.password}</p>
                    </div>
                    <span className="text-2xl opacity-50 group-hover:opacity-100 transition">
                      👉
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
