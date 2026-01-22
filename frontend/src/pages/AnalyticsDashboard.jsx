import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [apiIntegrations, setApiIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    fetchDashboardData();
    fetchAPIIntegrations();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getDashboard(dateRange);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load analytics dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchAPIIntegrations = async () => {
    try {
      const response = await analyticsService.getAPIIntegrations();
      setApiIntegrations(response.data);
    } catch (err) {
      console.error('Error fetching API integrations:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#67e8f9', '#a5f3fc'];

  const categoryData = dashboardData?.categoryBreakdown ? Object.entries(dashboardData.categoryBreakdown).map(([key, value]) => ({
    name: key,
    value: value
  })) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights and performance metrics</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>Last Year</option>
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Recommendations</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {dashboardData.totalRecommendations?.toFixed(0) || 0}
                  </p>
                </div>
                <div className="bg-teal-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboardData.totalBookings?.toFixed(0) || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m7 8H3v-8m14 0V7m0 10v4m0-10h4m-4 10H4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Sales */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Sales</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${dashboardData.totalSales?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* API Success Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">API Success Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {dashboardData.apiSuccessRate?.toFixed(1) || '0'}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          {categoryData.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activity by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* API Performance */}
          {dashboardData?.apiPerformance && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">API Performance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Total Requests</span>
                  <span className="font-bold text-teal-600">
                    {dashboardData.apiPerformance.totalAPIRequests || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span className="text-gray-700">Successful</span>
                  <span className="font-bold text-green-600">
                    {dashboardData.apiPerformance.successfulRequests || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <span className="text-gray-700">Failed</span>
                  <span className="font-bold text-red-600">
                    {dashboardData.apiPerformance.failedRequests || 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* API Integrations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">API Integrations Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">API Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Requests</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Success</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Errors</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Last Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {apiIntegrations.map((api) => (
                  <tr key={api.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">{api.apiName}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        api.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {api.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{api.requestCount || 0}</td>
                    <td className="px-6 py-3 text-sm text-green-600">{api.successCount || 0}</td>
                    <td className="px-6 py-3 text-sm text-red-600">{api.errorCount || 0}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {api.lastSyncTime ? new Date(api.lastSyncTime).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
