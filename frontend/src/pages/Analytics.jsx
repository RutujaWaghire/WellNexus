import React, { useState, useEffect } from 'react';
import { api, sessionService, orderService, practitionerService, productService } from '../services/api';

const Analytics = () => {
  const [metrics, setMetrics] = useState({
    totalSessions: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalPractitioners: 0,
    totalProducts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [sessionsRes, ordersRes, practitionersRes, productsRes] = await Promise.all([
        sessionService.getAll(),
        orderService.getAll(),
        practitionerService.getAll(),
        productService.getAll()
      ]);

      const sessions = sessionsRes.data || [];
      const orders = ordersRes.data || [];
      const practitioners = practitionersRes.data || [];
      const products = productsRes.data || [];

      const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setMetrics({
        totalSessions: sessions.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        totalPractitioners: practitioners.length,
        totalProducts: products.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        pendingSessions: sessions.filter(s => s.status === 'scheduled' || s.status === 'booked').length,
        verifiedPractitioners: practitioners.filter(p => p.verified).length,
        lowStockProducts: products.filter(p => p.stock < 10).length
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set default values on error
      setMetrics({
        totalSessions: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalPractitioners: 0,
        totalProducts: 0,
        completedSessions: 0,
        pendingSessions: 0,
        verifiedPractitioners: 0,
        lowStockProducts: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 fade-in">
      <div className="container mx-auto px-4">
        <div className="mb-8 slide-down">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span>📊</span>
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Platform overview and statistics</p>
        </div>

        {/* Main Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats-card slide-up stagger-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-800">{metrics.totalSessions}</p>
                <p className="text-xs text-green-600 mt-1">✓ {metrics.completedSessions} completed</p>
              </div>
              <div className="text-5xl">📅</div>
            </div>
          </div>

          <div className="stats-card slide-up stagger-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{metrics.totalOrders}</p>
                <p className="text-xs text-blue-600 mt-1">💰 Revenue</p>
              </div>
              <div className="text-5xl">🛒</div>
            </div>
          </div>

          <div className="stats-card slide-up stagger-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">₹{metrics.totalRevenue}</p>
                <p className="text-xs text-emerald-600 mt-1">📈 Growing</p>
              </div>
              <div className="text-5xl">💵</div>
            </div>
          </div>

          <div className="stats-card slide-up stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Practitioners</p>
                <p className="text-3xl font-bold text-gray-800">{metrics.totalPractitioners}</p>
                <p className="text-xs text-purple-600 mt-1">✓ {metrics.verifiedPractitioners} verified</p>
              </div>
              <div className="text-5xl">👨‍⚕️</div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="wellness-card slide-up">
            <h3 className="font-bold text-gray-800 mb-4">📦 Products</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products</span>
                <span className="font-bold">{metrics.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="font-bold text-red-600">{metrics.lowStockProducts}</span>
              </div>
            </div>
          </div>

          <div className="wellness-card slide-up">
            <h3 className="font-bold text-gray-800 mb-4">📅 Sessions</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-bold text-green-600">{metrics.completedSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-orange-600">{metrics.pendingSessions}</span>
              </div>
            </div>
          </div>

          <div className="wellness-card slide-up">
            <h3 className="font-bold text-gray-800 mb-4">⚙️ System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Platform</span>
                <span className="badge-success">🟢 Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API</span>
                <span className="badge-success">🟢 Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchData}
            className="btn-primary btn-animated px-8 py-3"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
