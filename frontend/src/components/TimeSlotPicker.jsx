import React, { useState, useEffect } from 'react';

/**
 * TimeSlotPicker Component
 * Shows available time slots for booking therapy sessions
 * Handles booked slots, disabled dates, and practitioner availability
 */
const TimeSlotPicker = ({ practitionerId, selectedDate, onSlotSelect, practitionerAvailability }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Generate time slots based on practitioner availability
  // Default: 9 AM to 6 PM with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = practitionerAvailability?.startHour || 9;
    const endHour = practitionerAvailability?.endHour || 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Load booked slots for the selected date
  useEffect(() => {
    if (selectedDate && practitionerId) {
      loadBookedSlots();
    }
  }, [selectedDate, practitionerId]);

  const loadBookedSlots = async () => {
    // Simulate loading booked slots from backend
    // In real app, fetch from API: /api/sessions/booked?practitionerId=X&date=Y
    const mockBookedSlots = [
      '10:00', '10:30', '14:00', '15:30'
    ];
    setBookedSlots(mockBookedSlots);
  };

  const isSlotBooked = (slot) => {
    return bookedSlots.includes(slot);
  };

  const handleSlotClick = (slot) => {
    if (isSlotBooked(slot)) return;
    
    setSelectedSlot(slot);
    onSlotSelect(slot);
  };

  const formatTime = (slot) => {
    const [hours, minutes] = slot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-gray-500">
        📅 Please select a date first
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        ⏰ Available Time Slots
        <span className="text-sm font-normal text-gray-500">
          ({selectedDate})
        </span>
      </h3>

      {/* Slot Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-green-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-600 rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {timeSlots.map((slot) => {
          const booked = isSlotBooked(slot);
          const selected = selectedSlot === slot;
          
          return (
            <button
              key={slot}
              onClick={() => handleSlotClick(slot)}
              disabled={booked}
              className={`time-slot ${
                selected 
                  ? 'time-slot-selected' 
                  : booked 
                    ? 'time-slot-booked' 
                    : 'time-slot-available'
              }`}
            >
              {formatTime(slot)}
            </button>
          );
        })}
      </div>

      {/* Selected Slot Info */}
      {selectedSlot && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between slide-down">
          <div className="flex items-center gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="font-semibold text-gray-800">Selected Time</p>
              <p className="text-lg text-green-700 font-bold">{formatTime(selectedSlot)}</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedSlot(null)}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            Clear
          </button>
        </div>
      )}

      {/* No slots available message */}
      {timeSlots.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg">
          <p className="text-gray-600">
            ⚠️ No slots available for this day
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
