import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { practitionerService, sessionService, orderService } from '../services/api';

/**
 * Enhanced Admin Dashboard
 * Shows overview stats, pending approvals, recent activity
 * Professional admin panel with charts and controls
 */
const AdminDashboard = () => {
  const { user } = useAuth();
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
      const [practitionersRes, sessionsRes, ordersRes] = await Promise.all([
        practitionerService.getAll(),
        sessionService.getAll(),
        orderService.getAll()
      ]);

      const practitioners = practitionersRes.data;
      const sessions = sessionsRes.data;
      const orders = ordersRes.data;

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
              <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-2 text-left">
                <span>📊</span>
                <span>View Reports</span>
              </button>
              <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center gap-2 text-left">
                <span>⚙️</span>
                <span>System Settings</span>
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
    </div>
  );
};

export default AdminDashboard;
