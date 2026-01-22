import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/analytics/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 rounded-lg shadow p-6 text-white">
          <p className="text-sm mb-2">Total Activities</p>
          <p className="text-3xl font-bold">{metrics?.totalActivities || 0}</p>
        </div>

        <div className="bg-green-500 rounded-lg shadow p-6 text-white">
          <p className="text-sm mb-2">System Uptime</p>
          <p className="text-3xl font-bold">{metrics?.uptime || '99.9%'}</p>
        </div>

        <div className="bg-purple-500 rounded-lg shadow p-6 text-white">
          <p className="text-sm mb-2">Status</p>
          <p className="text-3xl font-bold">Active</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <p className="text-gray-600">All systems operational</p>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Analytics;
