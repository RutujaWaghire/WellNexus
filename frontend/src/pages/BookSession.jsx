import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionService, practitionerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import TimeSlotPicker from '../components/TimeSlotPicker';

const BookSession = () => {
  const { practitionerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [practitioner, setPractitioner] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadPractitioner();
  }, [practitionerId]);

  const loadPractitioner = async () => {
    try {
      const response = await practitionerService.getAll();
      const found = response.data.find(p => p.id === parseInt(practitionerId));
      if (found) {
        setPractitioner(found);
      }
    } catch (error) {
      console.error('Error loading practitioner:', error);
    }
  };

  // Generate 15-minute time slots from 9:00 AM to 6:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTime(time);
        
        // Randomly mark some slots as booked (for demo)
        const isBooked = Math.random() < 0.2; // 20% chance
        
        slots.push({
          time,
          displayTime,
          isBooked,
          isPast: false // In real app, check if time is in the past
        });
      }
    }
    return slots;
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSlotSelect = (slotTime) => {
    const slot = {
      time: slotTime,
      displayTime: formatTime(slotTime)
    };
    setSelectedSlot(slot);
  };

  const handleAddToCart = () => {
    if (!selectedDate || !selectedSlot) {
      addToast('Please select date and time', 'warning');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '{"products": [], "sessions": []}');
    
    cart.sessions.push({
      practitionerId: parseInt(practitionerId),
      practitioner: `Practitioner #${practitioner?.userId || practitionerId}`,
      specialization: practitioner?.specialization || 'Alternative Therapy',
      date: selectedDate,
      time: selectedSlot.displayTime,
      fee: practitioner?.consultationFee || 500
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdate'));
    
    addToast('Session added to cart! 🛒', 'success');
    navigate('/cart');
  };

  const handleBooking = async () => {
    if (!user) {
      addToast('Please login to book a session', 'warning');
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedSlot) {
      addToast('Please select date and time', 'warning');
      return;
    }

    try {
      const dateTime = `${selectedDate}T${selectedSlot.time}:00`;
      
      // Use the practitioner's userId, not the profile id
      const practitionerUserId = practitioner?.userId || parseInt(practitionerId);
      
      console.log('Booking session - practitionerId:', practitionerId, 'practitioner.userId:', practitioner?.userId, 'using:', practitionerUserId);
      
      await sessionService.book({
        practitionerId: practitionerUserId,
        userId: user.userId,
        date: new Date(dateTime).toISOString()
      });
      
      setShowConfirmation(true);
      addToast('Session booked successfully! 🎉', 'success');
      
      // Emit refresh event for dashboard
      window.dispatchEvent(new Event('dashboardRefresh'));
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      addToast('Error booking session', 'error');
      console.error('Booking error:', error);
    }
  };

  const timeSlots = generateTimeSlots();
  const today = new Date().toISOString().split('T')[0];

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 fade-in">
        <div className="wellness-card max-w-md text-center scale-in">
          <div className="text-6xl mb-6 pulse-success">✅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-2">Your session has been scheduled</p>
          <div className="bg-green-50 rounded-lg p-4 my-6">
            <p className="font-semibold text-gray-800">📅 {selectedDate}</p>
            <p className="font-semibold text-gray-800">🕐 {selectedSlot?.displayTime}</p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 fade-in">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 slide-down">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📅 Book Therapy Session
          </h1>
          <p className="text-gray-600">Select your preferred date and time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Practitioner Info */}
            {practitioner && (
              <div className="wellness-card-hover slide-up">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
                    {practitioner.userId?.toString().charAt(0) || 'P'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Practitioner #{practitioner.userId}
                    </h3>
                    <p className="text-wellness-green font-semibold">
                      🎯 {practitioner.specialization}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <span>⭐ {practitioner.rating.toFixed(1)}</span>
                      <span>•</span>
                      <span className="font-bold">₹{practitioner.consultationFee || 500}/session</span>
                    </p>
                  </div>
                  {practitioner.verified && (
                    <span className="verified-badge">✓ Verified</span>
                  )}
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="wellness-card slide-up stagger-1">
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                📅 Select Date
              </label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null); // Reset slot when date changes
                }}
                className="input-field text-lg"
                required
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="wellness-card slide-up stagger-2">
                <TimeSlotPicker
                  practitionerId={practitionerId}
                  selectedDate={selectedDate}
                  onSlotSelect={handleSlotSelect}
                  practitionerAvailability={{
                    startHour: 9,
                    endHour: 18
                  }}
                />
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="wellness-card sticky top-24 slide-up stagger-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Practitioner</p>
                  <p className="font-semibold text-gray-800">
                    #{practitioner?.userId || practitionerId}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Specialization</p>
                  <p className="font-semibold text-gray-800">
                    {practitioner?.specialization || 'Alternative Therapy'}
                  </p>
                </div>

                {selectedDate && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {selectedSlot && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-800">
                      {selectedSlot.displayTime}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="text-2xl font-bold text-wellness-green">
                      ₹{practitioner?.consultationFee || 500}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedDate || !selectedSlot}
                  className="w-full btn-secondary btn-animated disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedSlot}
                  className="w-full btn-primary btn-animated disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✓ Book Now
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure booking • 24hr cancellation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
