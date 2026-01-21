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
    bio: '',
    documentFile: null,
    documentType: 'License'
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
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

    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      addToast('You must accept the terms and conditions', 'error');
      return;
    }

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

    if (formData.role === 'practitioner' && !formData.documentFile) {
      setError('Practitioners must upload a verification document');
      addToast('Practitioners must upload a verification document', 'error');
      return;
    }

    try {
      const registrationData = new FormData();
      registrationData.append('name', formData.name);
      registrationData.append('email', formData.email);
      registrationData.append('password', formData.password);
      registrationData.append('role', formData.role);
      registrationData.append('bio', formData.bio);
      
      if (formData.role === 'practitioner') {
        registrationData.append('documentType', formData.documentType);
        registrationData.append('documentFile', formData.documentFile);
      }

      await register(registrationData);
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

            {/* Document Upload for Practitioners */}
            {formData.role === 'practitioner' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">📄 Verification Documents</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Please upload documents to verify your credentials. This helps us ensure the quality of practitioners on our platform.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Document Type</label>
                    <select
                      className="input-field"
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    >
                      <option value="License">Professional License</option>
                      <option value="Certification">Certification</option>
                      <option value="Degree">Degree/Qualification</option>
                      <option value="Insurance">Insurance Certificate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Upload Document</label>
                    <input
                      type="file"
                      required
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="input-field"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const maxSize = 10 * 1024 * 1024; // 10MB
                          if (file.size > maxSize) {
                            setError('File size must be less than 10MB');
                            addToast('File size must be less than 10MB', 'error');
                            e.target.value = '';
                          } else {
                            setFormData({ ...formData, documentFile: file });
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                    </p>
                  </div>
                </div>

                {formData.documentFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800">
                      ✓ Selected file: <span className="font-semibold">{formData.documentFile.name}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Terms and Conditions */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                <label htmlFor="terms" className="flex-1 cursor-pointer">
                  <span className="text-gray-700">I agree to the </span>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-wellness-green hover:underline font-semibold"
                  >
                    Terms and Conditions
                  </button>
                  <span className="text-gray-700"> and </span>
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-wellness-green hover:underline font-semibold"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              {!termsAccepted && (
                <p className="text-red-600 text-sm mt-2">⚠️ You must accept the terms to continue</p>
              )}
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

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Terms and Conditions</h2>
            </div>
            
            <div className="p-6 space-y-4 text-gray-700">
              <section>
                <h3 className="font-bold text-lg mb-2">1. Acceptance of Terms</h3>
                <p>By registering on WellNexus, you accept and agree to be bound by all terms and conditions outlined below.</p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2">2. User Responsibilities</h3>
                <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2">3. Professional Standards</h3>
                <p className="mb-2">Practitioners agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Maintain professional conduct and ethical standards</li>
                  <li>Provide accurate and truthful information about credentials</li>
                  <li>Respect patient privacy and confidentiality</li>
                  <li>Follow all applicable laws and regulations</li>
                  <li>Not engage in any fraudulent or illegal activities</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2">4. Document Verification</h3>
                <p>Practitioners must upload valid professional documents for verification by our admin team. False or fraudulent documents may result in account suspension.</p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2">5. Liability Disclaimer</h3>
                <p>WellNexus provides a platform to connect patients with wellness practitioners. We are not responsible for the quality, accuracy, or legality of services provided by practitioners.</p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-2">6. Amendments</h3>
                <p>We reserve the right to modify these terms at any time. Continued use of the platform following changes constitutes your acceptance of new terms.</p>
              </section>
            </div>

            <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white flex gap-4">
              <button
                onClick={() => setShowTermsModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className="flex-1 px-4 py-2 bg-wellness-green text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
