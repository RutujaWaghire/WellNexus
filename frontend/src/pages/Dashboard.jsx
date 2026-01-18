import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionService, orderService, practitionerService, recommendationService, paymentService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [practitionerProfile, setPractitionerProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [symptom, setSymptom] = useState('');
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentItem, setPaymentItem] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const openPaymentModal = (item, type) => {
    setPaymentItem({ ...item, type });
    setShowPaymentModal(true);
    setUpiId('');
    setMessage('');
  };

  const handlePayment = async () => {
    if (!upiId.trim()) {
      setMessage('Please enter a UPI ID');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        amount: paymentItem.type === 'order' ? paymentItem.totalAmount : 100, // Default session amount
        upiId: upiId,
        paymentMethod: 'UPI',
        ...(paymentItem.type === 'order' && { orderId: paymentItem.id }),
        ...(paymentItem.type === 'session' && { sessionId: paymentItem.id }),
      };

      const response = await paymentService.processPayment(paymentData);
      
      if (response.data.status === 'SUCCESS') {
        setMessage('✓ Payment successful! Transaction ID: ' + response.data.transactionId);
        setTimeout(() => {
          setShowPaymentModal(false);
          loadDashboardData();
        }, 2000);
      } else {
        setMessage('Payment failed: ' + response.data.message);
      }
    } catch (error) {
      setMessage('Error processing payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPendingOrders = () => orders.filter(o => o.status === 'pending');
  const getPendingSessions = () => sessions.filter(s => s.status === 'booked');

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
                  <p><strong>Practitioner:</strong> {session.practitionerName || 'Unknown'}</p>
                  <p><strong>Specialization:</strong> {session.practitionerSpecialization || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(session.date).toLocaleString()}</p>
                  <p><strong>Status:</strong> <span className="text-teal-600 font-semibold">{session.status}</span></p>
                  {session.status === 'booked' && (
                    <button
                      onClick={() => openPaymentModal(session, 'session')}
                      className="mt-3 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    >
                      Submit & Pay
                    </button>
                  )}
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
                  <p><strong>Product:</strong> {order.productName || 'Unknown'}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Status:</strong> <span className="text-teal-600 font-semibold">{order.status}</span></p>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => openPaymentModal(order, 'order')}
                      className="mt-3 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    >
                      Submit & Pay
                    </button>
                  )}
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">UPI Payment</h3>
            
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="text-3xl font-bold text-teal-600">
                ₹{paymentItem?.type === 'order' ? paymentItem?.totalAmount : '100'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {paymentItem?.type === 'order' ? 'Order' : 'Session'} Payment
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Enter UPI ID</label>
              <input
                type="text"
                placeholder="example@okhdfcbank"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-teal-600"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded text-sm ${
                message.startsWith('✓') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
