import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { practitionerService } from '../services/api';
import { useToast } from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import SearchFilter from '../components/SearchFilter';

const Practitioners = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [filteredPractitioners, setFilteredPractitioners] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadPractitioners();
  }, [filter]);

  const loadPractitioners = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'all') {
        response = await practitionerService.getAll();
      } else if (filter === 'verified') {
        response = await practitionerService.getVerified();
      } else {
        response = await practitionerService.getBySpecialization(filter);
      }
      setPractitioners(response.data);
      setFilteredPractitioners(response.data);
    } catch (error) {
      console.error('Error loading practitioners:', error);
      addToast('Failed to load practitioners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPractitioners(practitioners);
      return;
    }

    const filtered = practitioners.filter(p =>
      p.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userId.toString().includes(searchTerm)
    );
    setFilteredPractitioners(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...practitioners];

    // Filter by rating
    if (filters.minRating) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }

    // Filter by verification
    if (filters.verified !== undefined && filters.verified !== null) {
      filtered = filtered.filter(p => p.verified === filters.verified);
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.includes('+') 
        ? [parseInt(filters.priceRange), Infinity]
        : filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => {
        const fee = p.consultationFee || 500;
        return fee >= min && (max ? fee <= max : true);
      });
    }

    // Sort
    if (filters.sortBy) {
      switch(filters.sortBy) {
        case 'rating-high':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'rating-low':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case 'price-high':
          filtered.sort((a, b) => (b.consultationFee || 500) - (a.consultationFee || 500));
          break;
        case 'price-low':
          filtered.sort((a, b) => (a.consultationFee || 500) - (b.consultationFee || 500));
          break;
      }
    }

    setFilteredPractitioners(filtered);
  };

  const specializations = [
    { name: 'All', value: 'all', emoji: '👥' },
    { name: 'Verified', value: 'verified', emoji: '✓' },
    { name: 'Physiotherapy', value: 'Physiotherapy', emoji: '🏋️' },
    { name: 'Acupuncture', value: 'Acupuncture', emoji: '💉' },
    { name: 'Ayurveda', value: 'Ayurveda', emoji: '🌿' },
    { name: 'Yoga Therapy', value: 'Yoga Therapy', emoji: '🧘' },
    { name: 'Reiki', value: 'Reiki Healing', emoji: '✨' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 slide-down">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            👨‍⚕️ Find Expert Practitioners
          </h1>
          <p className="text-xl text-gray-600">
            Connect with verified alternative therapy experts
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 slide-up">
          {specializations.map((spec) => (
            <button
              key={spec.value}
              onClick={() => setFilter(spec.value)}
              className={`px-5 py-2 rounded-full font-semibold transition-all btn-animated flex items-center gap-2 ${
                filter === spec.value
                  ? 'bg-wellness-green text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <span>{spec.emoji}</span>
              <span>{spec.name}</span>
            </button>
          ))}
        </div>

        {/* Advanced Search & Filters */}
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={{
            priceRange: true,
            rating: true,
            verified: true,
            sortBy: true
          }}
          placeholder="Search by name, specialization, or practitioner ID..."
        />

        {/* Practitioners Grid */}
        {loading ? (
          <SkeletonLoader type="card" count={6} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractitioners.map((practitioner, index) => (
              <div 
                key={practitioner.id} 
                className={`wellness-card-hover slide-up stagger-${(index % 4) + 1}`}
              >
                {/* Profile Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
                      {practitioner.userId ? practitioner.userId.toString().charAt(0) : 'P'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {practitioner.name || `Practitioner #${practitioner.userId}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {practitioner.id}
                      </p>
                    </div>
                  </div>
                  {practitioner.verified && (
                    <span className="verified-badge">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Specialization Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm">
                    🎯 {practitioner.specialization}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Rating</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <span className="text-xl font-bold text-orange-600">
                        {practitioner.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Consultation Fee</span>
                    <span className="text-xl font-bold text-wellness-green">
                      ₹{practitioner.consultationFee || 500}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/book-session/${practitioner.id}`}
                  className="block text-center btn-primary btn-animated w-full"
                >
                  📅 Book Session
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredPractitioners.length === 0 && (
          <div className="text-center py-16 wellness-card max-w-md mx-auto scale-in">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl text-gray-600 mb-6">No practitioners found</p>
            <button
              onClick={() => setFilter('all')}
              className="btn-primary btn-animated"
            >
              View All Practitioners
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practitioners;
