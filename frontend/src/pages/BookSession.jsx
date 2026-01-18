import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookSession = () => {
  const { practitionerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await sessionService.book({
        practitionerId: parseInt(practitionerId),
        userId: user.userId,
        date: new Date(date).toISOString()
      });
      alert('Session booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error booking session: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Book Session</h1>
        
        <form onSubmit={handleBooking} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Practitioner ID</label>
            <input
              type="text"
              value={practitionerId}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Select Date & Time</label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookSession;
