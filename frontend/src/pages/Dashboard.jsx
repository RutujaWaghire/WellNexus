import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { sessionService, orderService, practitionerService, recommendationService } from '../services/api';
import AdminDashboard from './AdminDashboard';
import PractitionerDashboard from './PractitionerDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Route to appropriate dashboard based on role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  
  if (user?.role === 'practitioner') {
    return <PractitionerDashboard />;
  }
  
  // Patient Dashboard
  return <PatientDashboard />;
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [practitionerProfile, setPractitionerProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [symptom, setSymptom] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const sessionsRes = await sessionService.getUserSessions(user.userId);
      setSessions(sessionsRes.data);

      const ordersRes = await orderService.getUserOrders(user.userId);
      setOrders(ordersRes.data);

      const recsRes = await recommendationService.getUserRecommendations(user.userId);
      setRecommendations(recsRes.data);

      if (user.role === 'practitioner') {
        const profileRes = await practitionerService.getByUserId(user.userId);
        setPractitionerProfile(profileRes.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const handleGetRecommendation = async (e) => {
    e.preventDefault();
    try {
      await recommendationService.generate({ userId: user.userId, symptom });
      setSymptom('');
      loadDashboardData();
    } catch (error) {
      console.error('Error generating recommendation:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
          <form onSubmit={handleGetRecommendation} className="mb-4">
            <input
              type="text"
              placeholder="Enter your symptom..."
              className="w-full px-4 py-2 border rounded-lg mb-2"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              required
            />
            <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
              Get Recommendation
            </button>
          </form>
          <div className="space-y-2">
            {recommendations.map(rec => (
              <div key={rec.id} className="bg-gray-50 p-3 rounded">
                <p><strong>Symptom:</strong> {rec.symptom}</p>
                <p><strong>Suggested:</strong> {rec.suggestedTherapy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* My Sessions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">My Sessions</h2>
          <div className="space-y-3">
            {sessions.length === 0 ? (
              <p className="text-gray-500">No sessions booked yet</p>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Date:</strong> {new Date(session.date).toLocaleString()}</p>
                  <p><strong>Status:</strong> <span className="text-teal-600">{session.status}</span></p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Orders */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Total:</strong> ${order.totalAmount}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Status:</strong> <span className="text-teal-600">{order.status}</span></p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Practitioner Profile */}
        {user.role === 'practitioner' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Practitioner Profile</h2>
            {practitionerProfile ? (
              <div className="space-y-2">
                <p><strong>Specialization:</strong> {practitionerProfile.specialization}</p>
                <p><strong>Verified:</strong> {practitionerProfile.verified ? '✓ Yes' : '✗ No'}</p>
                <p><strong>Rating:</strong> ⭐ {practitionerProfile.rating.toFixed(1)}</p>
              </div>
            ) : (
              <p className="text-gray-500">No practitioner profile yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

