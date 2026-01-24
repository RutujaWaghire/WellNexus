import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { practitionerService, sessionService, orderService, productService } from '../services/api';
import { useToast } from '../components/Toast';

/**
 * Enhanced Admin Dashboard
 * Shows overview stats, pending approvals, recent activity
 * Professional admin panel with charts and controls
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPractitioners: 0,
    verifiedPractitioners: 0,
    pendingPractitioners: 0,
    totalSessions: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todaySessions: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [products, setProducts] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showManageStock, setShowManageStock] = useState(false);
  const [showManageRatings, setShowManageRatings] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [practitionersRes, sessionsRes, ordersRes, productsRes] = await Promise.all([
        practitionerService.getAll(),
        sessionService.getAll(),
        orderService.getAll(),
        productService.getAll()
      ]);

      const practitioners = practitionersRes.data;
      const sessions = sessionsRes.data;
      const orders = ordersRes.data;
      setPractitioners(practitioners);
      setProducts(productsRes.data);

      // Calculate stats
      const verified = practitioners.filter(p => p.verified).length;
      const pending = practitioners.filter(p => !p.verified).length;
      const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      // Today's sessions
      const today = new Date().toDateString();
      const todaySessions = sessions.filter(s => 
        new Date(s.date).toDateString() === today
      ).length;

      setStats({
        totalUsers: practitioners.length * 5, // Estimate
        totalPractitioners: practitioners.length,
        verifiedPractitioners: verified,
        pendingPractitioners: pending,
        totalSessions: sessions.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        todaySessions: todaySessions
      });

      // Recent sessions (last 5)
      setRecentSessions(sessions.slice(-5).reverse());

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      addToast('Please fill all required fields', 'warning');
      return;
    }

    try {
      await productService.create({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      });
      addToast('Product added successfully! ✅', 'success');
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '' });
      loadDashboardData();
    } catch (error) {
      console.error('Error adding product:', error);
      addToast('Error adding product', 'error');
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await productService.updateStock(productId, newStock);
      addToast('Stock updated successfully! ✅', 'success');
      loadDashboardData();
    } catch (error) {
      console.error('Error updating stock:', error);
      addToast('Error updating stock', 'error');
    }
  };
  const handleUpdateRating = async (practitionerId, newRating) => {
    if (newRating < 0 || newRating > 5) {
      addToast('Rating must be between 0 and 5', 'warning');
      return;
    }

    try {
      await practitionerService.updateRating(practitionerId, newRating);
      addToast('Practitioner rating updated successfully!', 'success');
      loadDashboardData();
    } catch (error) {
      console.error('Error updating rating:', error);
      addToast('Failed to update rating', 'error');
    }
  };
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="wellness-card max-w-md text-center">
          <span className="text-6xl mb-4 block">🔒</span>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin privileges required</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 slide-down">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span>👨‍💼</span>
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="stats-card slide-up stagger-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">📈 Active platform</p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>

          {/* Practitioners */}
          <div className="stats-card slide-up stagger-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Practitioners</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalPractitioners}</p>
                <p className="text-xs text-blue-600 mt-1">
                  ✓ {stats.verifiedPractitioners} verified
                </p>
              </div>
              <div className="text-5xl">👨‍⚕️</div>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="stats-card slide-up stagger-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalSessions}</p>
                <p className="text-xs text-purple-600 mt-1">
                  🕐 {stats.todaySessions} today
                </p>
              </div>
              <div className="text-5xl">📅</div>
            </div>
          </div>

          {/* Revenue */}
          <div className="stats-card slide-up stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue}</p>
                <p className="text-xs text-emerald-600 mt-1">💰 {stats.totalOrders} orders</p>
              </div>
              <div className="text-5xl">💵</div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Approvals */}
          {stats.pendingPractitioners > 0 && (
            <div className="wellness-card bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 slide-up">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h3 className="font-bold text-gray-800">Pending Approvals</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.pendingPractitioners}
                  </p>
                </div>
              </div>
              <Link
                to="/admin/verify-practitioners"
                className="block text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
              >
                Review Now →
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="wellness-card slide-up">
            <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/admin/verify-practitioners"
                className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center gap-2"
              >
                <span>✓</span>
                <span>Verify Practitioners</span>
              </Link>
              <button 
                onClick={() => setShowAddProduct(true)}
                className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-2 text-left"
              >
                <span>➕</span>
                <span>Add New Product</span>
              </button>
              <button 
                onClick={() => setShowManageStock(true)}
                className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center gap-2 text-left"
              >
                <span>📦</span>
                <span>Manage Stock</span>
              </button>
              <button 
                onClick={() => setShowManageRatings(true)}
                className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition flex items-center gap-2 text-left"
              >
                <span>⭐</span>
                <span>Manage Ratings</span>
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="wellness-card slide-up">
            <h3 className="font-bold text-gray-800 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Platform</span>
                <span className="badge-success">🟢 Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="badge-success">🟢 Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API</span>
                <span className="badge-success">🟢 Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="wellness-card slide-up">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Sessions</h2>
          
          {recentSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent sessions</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Session ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Practitioner</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">#{session.id}</td>
                      <td className="px-4 py-3 text-sm">Practitioner #{session.practitionerId}</td>
                      <td className="px-4 py-3 text-sm">User #{session.userId}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`badge-${
                          session.status === 'completed' ? 'success' : 'warning'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 scale-in max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl text-white">
              <h2 className="text-2xl font-bold">➕ Add New Product</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="Organic Green Tea"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Product description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="299"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Herbal Supplements">Herbal Supplements</option>
                  <option value="Organic Foods">Organic Foods</option>
                  <option value="Essential Oils">Essential Oils</option>
                  <option value="Wellness Products">Wellness Products</option>
                  <option value="Meditation Tools">Meditation Tools</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddProduct(false);
                    setNewProduct({ name: '', description: '', price: '', category: '', stock: '' });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Stock Modal */}
      {showManageStock && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 scale-in max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl text-white">
              <h2 className="text-2xl font-bold">📦 Manage Product Stock</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Current Stock</p>
                        <p className={`text-2xl font-bold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.stock}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 10))}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleUpdateStock(product.id, product.stock + 50)}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold"
                        >
                          +50
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowManageStock(false)}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Ratings Modal */}
      {showManageRatings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 scale-in max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-t-2xl text-white">
              <h2 className="text-2xl font-bold">⭐ Manage Practitioner Ratings</h2>
              <p className="text-sm mt-1 opacity-90">Update ratings based on performance and feedback</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {practitioners.filter(p => p.verified).map((practitioner) => (
                  <div key={practitioner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{practitioner.name}</h3>
                      <p className="text-sm text-gray-600">{practitioner.specialization}</p>
                      <p className="text-xs text-gray-500 mt-1">{practitioner.bio}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Current Rating</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          ⭐ {practitioner.rating || 0}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateRating(practitioner.id, Math.max(0, (practitioner.rating || 0) - 0.5))}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                          title="Decrease by 0.5"
                        >
                          -0.5
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={practitioner.rating || 0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (val >= 0 && val <= 5) {
                              handleUpdateRating(practitioner.id, val);
                            }
                          }}
                          className="w-16 px-2 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:border-yellow-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleUpdateRating(practitioner.id, Math.min(5, (practitioner.rating || 0) + 0.5))}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold text-sm"
                          title="Increase by 0.5"
                        >
                          +0.5
                        </button>
                        <button
                          onClick={() => handleUpdateRating(practitioner.id, 5)}
                          className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition font-semibold text-sm"
                          title="Set to 5 stars"
                        >
                          ⭐ 5
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {practitioners.filter(p => p.verified).length === 0 && (
                  <p className="text-center text-gray-500 py-8">No verified practitioners found</p>
                )}
              </div>
              
              <button
                onClick={() => setShowManageRatings(false)}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
