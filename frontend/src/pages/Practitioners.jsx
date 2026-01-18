import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { practitionerService } from '../services/api';

const Practitioners = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPractitioners();
  }, [filter]);

  const loadPractitioners = async () => {
    try {
      let response;
      if (filter === 'all') {
        response = await practitionerService.getAll();
      } else if (filter === 'verified') {
        response = await practitionerService.getVerified();
      } else {
        response = await practitionerService.getBySpecialization(filter);
      }
      setPractitioners(response.data);
    } catch (error) {
      console.error('Error loading practitioners:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Practitioners</h1>
      
      {/* Filters */}
      <div className="mb-8 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-4 py-2 rounded-lg ${filter === 'verified' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
        >
          Verified
        </button>
        <button
          onClick={() => setFilter('Physiotherapy')}
          className={`px-4 py-2 rounded-lg ${filter === 'Physiotherapy' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
        >
          Physiotherapy
        </button>
        <button
          onClick={() => setFilter('Acupuncture')}
          className={`px-4 py-2 rounded-lg ${filter === 'Acupuncture' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
        >
          Acupuncture
        </button>
        <button
          onClick={() => setFilter('Ayurveda')}
          className={`px-4 py-2 rounded-lg ${filter === 'Ayurveda' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
        >
          Ayurveda
        </button>
      </div>

      {/* Practitioners Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {practitioners.map(practitioner => (
          <div key={practitioner.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{practitioner.name}</h3>
              {practitioner.verified && <span className="text-green-600">✓ Verified</span>}
            </div>
            <p className="text-gray-600 mb-2">
              <strong>Specialization:</strong> {practitioner.specialization}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Rating:</strong> ⭐ {practitioner.rating.toFixed(1)}
            </p>
            <Link
              to={`/book-session/${practitioner.id}`}
              className="block text-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Book Session
            </Link>
          </div>
        ))}
      </div>

      {practitioners.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No practitioners found</p>
      )}
    </div>
  );
};

export default Practitioners;
