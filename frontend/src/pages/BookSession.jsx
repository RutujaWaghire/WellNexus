import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sessionService } from "../services/api";
import { useAuth } from "../context/AuthContext";

const BookSession = () => {
  const { practitionerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await sessionService.book({
        practitionerId: parseInt(practitionerId),
        userId: user.userId,
        date: new Date(date).toISOString(),
      });

      alert("Session booked successfully 🌿");
      navigate("/dashboard");
    } catch (error) {
      alert(
        "Error booking session: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/00/45/27/00/360_F_45270035_xs5LemZ7pbjm1vIbMGLoA0YRDB9hxOxl.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/75"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#2f5f59]">
          Book a Therapy Session
        </h1>

        <p className="text-center text-sm text-[#6f8f89] mb-8">
          Choose your preferred time and confirm your wellness journey ✨
        </p>

        <form onSubmit={handleBooking} className="space-y-6">
          {/* Practitioner */}
          <div>
            <label className="block text-sm font-medium text-[#355f5b] mb-2">
              Practitioner ID
            </label>
            <input
              type="text"
              value={practitionerId}
              disabled
              className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-[#355f5b] mb-2">
              Select Date & Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Confirm Booking
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookSession;
