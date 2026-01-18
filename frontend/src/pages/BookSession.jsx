import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookSession = () => {
  const { practitionerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Generate time slots from 8am to 8pm (8:00 to 20:00)
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    const startHour = hour;
    const endHour = hour + 1;
    const startTime = `${String(startHour).padStart(2, '0')}:00`;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;
    
    const startLabel = startHour <= 12 ? 
      `${startHour === 12 ? 12 : startHour}:00 ${startHour < 12 ? 'AM' : 'PM'}` :
      `${startHour - 12}:00 PM`;
    const endLabel = endHour <= 12 ? 
      `${endHour === 12 ? 12 : endHour}:00 ${endHour < 12 ? 'AM' : 'PM'}` :
      `${endHour - 12}:00 PM`;
    
    timeSlots.push({
      value: startTime,
      label: `${startLabel} - ${endLabel}`
    });
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedSlot) {
      alert('Please select both date and time slot');
      return;
    }

    try {
      // Combine date and time slot
      const [hours, minutes] = selectedSlot.split(':');
      
      // Create a date object and set the time in local timezone
      const bookingDateTime = new Date(selectedDate + 'T' + selectedSlot + ':00');
      
      // Adjust for timezone to send correct UTC time
      const timezoneOffset = bookingDateTime.getTimezoneOffset() * 60000;
      const adjustedDateTime = new Date(bookingDateTime.getTime() + timezoneOffset);

      await sessionService.book({
        practitionerId: parseInt(practitionerId),
        userId: user.userId,
        date: adjustedDateTime.toISOString()
      });
      alert('Session booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error booking session: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  // Get today's date and prevent selecting past dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Book a Session</h1>
        
        <form onSubmit={handleBooking} className="space-y-8">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Practitioner ID</label>
            <input
              type="text"
              value={practitionerId}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-4">Select Date</label>
            <input
              type="date"
              min={today}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {selectedDate && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>

          {selectedDate && (
            <div>
              <label className="block text-gray-700 font-semibold mb-4">Select Time Slot</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setSelectedSlot(slot.value)}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition ${
                      selectedSlot === slot.value
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-teal-600'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
              {selectedSlot && (
                <p className="mt-3 text-sm text-gray-600">
                  Selected Time: {timeSlots.find(s => s.value === selectedSlot)?.label}
                </p>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!selectedDate || !selectedSlot}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookSession;
