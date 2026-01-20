import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

/**
 * Practitioner Dashboard Component
 * Manage availability, view bookings, upload documents, see earnings
 */
const PractitionerDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [availability, setAvailability] = useState({
    monday: { enabled: true, start: '09:00', end: '18:00' },
    tuesday: { enabled: true, start: '09:00', end: '18:00' },
    wednesday: { enabled: true, start: '09:00', end: '18:00' },
    thursday: { enabled: true, start: '09:00', end: '18:00' },
    friday: { enabled: true, start: '09:00', end: '18:00' },
    saturday: { enabled: false, start: '09:00', end: '14:00' },
    sunday: { enabled: false, start: '09:00', end: '14:00' }
  });

  const [documents, setDocuments] = useState([
    { name: 'Medical License', status: 'pending', uploadDate: '2025-01-15' },
    { name: 'Certification', status: 'approved', uploadDate: '2025-01-10' }
  ]);

  const [earnings, setEarnings] = useState({
    today: 1500,
    thisWeek: 8500,
    thisMonth: 28000,
    total: 125000,
    sessionsCompleted: 56
  });

  const [todaySessions, setTodaySessions] = useState([
    { id: 1, patient: 'Patient #123', time: '10:00 AM', status: 'completed' },
    { id: 2, patient: 'Patient #456', time: '11:30 AM', status: 'completed' },
    { id: 3, patient: 'Patient #789', time: '02:00 PM', status: 'upcoming' },
    { id: 4, patient: 'Patient #234', time: '03:30 PM', status: 'upcoming' }
  ]);

  const handleAvailabilityToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled
      }
    }));
    addToast(`${day.charAt(0).toUpperCase() + day.slice(1)} availability updated`, 'success');
  };

  const handleTimeChange = (day, type, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };

  const handleDocumentUpload = () => {
    addToast('Document upload feature coming soon!', 'info');
  };

  const saveAvailability = () => {
    // In real app, send to backend
    addToast('Availability saved successfully! ✅', 'success');
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 slide-down">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span>👨‍⚕️</span>
            Practitioner Dashboard
          </h1>
          <p className="text-gray-600">Manage your practice and availability</p>
        </div>

        {/* Earnings Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats-card slide-up stagger-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today</p>
                <p className="text-3xl font-bold text-gray-800">₹{earnings.today}</p>
              </div>
              <div className="text-5xl">💵</div>
            </div>
          </div>

          <div className="stats-card slide-up stagger-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-gray-800">₹{earnings.thisWeek}</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>

          <div className="stats-card slide-up stagger-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-3xl font-bold text-gray-800">₹{earnings.thisMonth}</p>
              </div>
              <div className="text-5xl">📈</div>
            </div>
          </div>

          <div className="stats-card slide-up stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-800">{earnings.sessionsCompleted}</p>
              </div>
              <div className="text-5xl">🎯</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Today's Sessions */}
            <div className="wellness-card slide-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Today's Sessions</h2>
              <div className="space-y-3">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{session.patient}</p>
                      <p className="text-sm text-gray-600">🕐 {session.time}</p>
                    </div>
                    <span
                      className={`badge-${
                        session.status === 'completed' ? 'success' : 'warning'
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="wellness-card slide-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📄 Documents</h2>
              <div className="space-y-3 mb-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{doc.name}</p>
                      <p className="text-sm text-gray-600">Uploaded: {doc.uploadDate}</p>
                    </div>
                    <span
                      className={`badge-${
                        doc.status === 'approved'
                          ? 'success'
                          : doc.status === 'pending'
                          ? 'warning'
                          : 'error'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleDocumentUpload}
                className="w-full btn-secondary btn-animated"
              >
                📤 Upload New Document
              </button>
            </div>
          </div>

          {/* Right Column - Availability */}
          <div className="wellness-card slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⏰ Set Availability</h2>
            
            <div className="space-y-4 mb-6">
              {days.map((day) => (
                <div
                  key={day}
                  className={`p-4 rounded-lg border-2 transition ${
                    availability[day].enabled
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-800 capitalize">{day}</span>
                    <button
                      onClick={() => handleAvailabilityToggle(day)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        availability[day].enabled
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {availability[day].enabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {availability[day].enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-600 block mb-1">Start</label>
                        <input
                          type="time"
                          value={availability[day].start}
                          onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 block mb-1">End</label>
                        <input
                          type="time"
                          value={availability[day].end}
                          onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={saveAvailability}
              className="w-full btn-primary btn-animated"
            >
              💾 Save Availability
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your availability will be visible to patients when booking sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDashboard;
