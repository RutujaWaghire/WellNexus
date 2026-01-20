import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    bio: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const getPasswordStrength = (password) => {
    if (!password) return { strength: '', color: '', width: '0%' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 3) return { strength: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { strength: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      addToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      addToast('Password must be at least 8 characters', 'error');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        bio: formData.bio
      });
      addToast('Registration successful! Welcome! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      let errorMsg = 'Registration failed. Please try again.';
      
      if (err.response) {
        errorMsg = err.response.data?.message || err.response.data || errorMsg;
      } else if (err.request) {
        errorMsg = 'Cannot connect to server. Please check if backend is running.';
      } else {
        errorMsg = err.message || errorMsg;
      }
      
      setError(errorMsg);
      addToast(errorMsg, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-12 px-4 fade-in">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 slide-down">
          <h2 className="text-5xl font-bold text-gray-800 mb-2">🌿 Join WellNexus</h2>
          <p className="text-gray-600">Create your account and start your wellness journey</p>
        </div>

        <div className="wellness-card scale-in">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded mb-6 slide-down">
              <p className="font-semibold">❌ {error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection Cards */}
            <div>
              <label className="block text-gray-700 font-bold mb-3">Select Your Role</label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setFormData({ ...formData, role: 'patient' })}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all btn-animated ${
                    formData.role === 'patient'
                      ? 'border-wellness-green bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">🧘</div>
                  <h3 className="font-bold text-lg text-gray-800">Patient</h3>
                  <p className="text-sm text-gray-600">Seeking wellness services</p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, role: 'practitioner' })}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all btn-animated ${
                    formData.role === 'practitioner'
                      ? 'border-wellness-green bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">👨‍⚕️</div>
                  <h3 className="font-bold text-lg text-gray-800">Practitioner</h3>
                  <p className="text-sm text-gray-600">Offering therapy services</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min. 8 characters"
                  className="input-field pr-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.strength === 'Strong' ? 'text-green-600' :
                      passwordStrength.strength === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with uppercase, lowercase, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                className={`input-field ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : ''
                }`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">❌ Passwords do not match</p>
              )}
            </div>
            
            {/* Bio */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Bio {formData.role === 'practitioner' && <span className="text-wellness-green">(Recommended)</span>}
              </label>
              <textarea
                className="input-field"
                rows="3"
                placeholder={formData.role === 'practitioner' 
                  ? 'Tell patients about your expertise and experience...'
                  : 'Tell us about yourself... (optional)'
                }
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary btn-animated"
            >
              Create Account
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-wellness-green hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
