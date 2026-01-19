import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  sessionService,
  orderService,
  practitionerService,
  recommendationService,
} from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [practitionerProfile, setPractitionerProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [symptom, setSymptom] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const sessionsRes = await sessionService.getUserSessions(user.userId);
      setSessions(sessionsRes.data);

      const ordersRes = await orderService.getUserOrders(user.userId);
      setOrders(ordersRes.data);

      const recsRes = await recommendationService.getUserRecommendations(
        user.userId
      );
      setRecommendations(recsRes.data);

      if (user.role === "practitioner") {
        const profileRes = await practitionerService.getByUserId(user.userId);
        setPractitionerProfile(profileRes.data);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  const handleGetRecommendation = async (e) => {
    e.preventDefault();
    try {
      await recommendationService.generate({
        userId: user.userId,
        symptom,
      });
      setSymptom("");
      loadDashboardData();
    } catch (error) {
      console.error("Error generating recommendation:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-10 px-4"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/00/45/27/00/360_F_45270035_xs5LemZ7pbjm1vIbMGLoA0YRDB9hxOxl.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/75"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-[#2f5f59]">
          Welcome back, {user?.name || "User"} 🌿
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Recommendations */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#355f5b]">
              AI Wellness Recommendations
            </h2>

            <form onSubmit={handleGetRecommendation} className="mb-4">
              <input
                type="text"
                placeholder="Describe your symptom..."
                className="w-full px-4 py-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                required
              />
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">
                Get Recommendation
              </button>
            </form>

            <div className="space-y-3">
              {recommendations.length === 0 ? (
                <p className="text-gray-500">
                  No recommendations generated yet
                </p>
              ) : (
                recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-[#eef4f2] p-3 rounded-lg"
                  >
                    <p>
                      <strong>Symptom:</strong> {rec.symptom}
                    </p>
                    <p>
                      <strong>Suggested Therapy:</strong>{" "}
                      {rec.suggestedTherapy}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Sessions */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#355f5b]">
              My Sessions
            </h2>

            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-gray-500">No sessions booked yet</p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-[#eef4f2] p-4 rounded-lg"
                  >
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(session.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="text-teal-700 font-medium">
                        {session.status}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Orders */}
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#355f5b]">
              My Orders
            </h2>

            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders placed yet</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#eef4f2] p-4 rounded-lg"
                  >
                    <p>
                      <strong>Total:</strong> ₹{order.totalAmount}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {order.quantity}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="text-teal-700 font-medium">
                        {order.status}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Practitioner Profile */}
          {user.role === "practitioner" && (
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 text-[#355f5b]">
                Practitioner Profile
              </h2>

              {practitionerProfile ? (
                <div className="space-y-2">
                  <p>
                    <strong>Specialization:</strong>{" "}
                    {practitionerProfile.specialization || "Not set"}
                  </p>
                  <p>
                    <strong>Verified:</strong>{" "}
                    {practitionerProfile.verified ? "✔ Yes" : "⏳ Pending"}
                  </p>
                  <p>
                    <strong>Rating:</strong> ⭐{" "}
                    {practitionerProfile.rating.toFixed(1)}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">
                  Practitioner profile not available
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
