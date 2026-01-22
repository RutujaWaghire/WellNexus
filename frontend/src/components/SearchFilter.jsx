import React, { useState } from 'react';

/**
 * SearchFilter Component
 * Provides smart search and filtering options
 * Used for practitioners and products
 */
const SearchFilter = ({ onSearch, onFilter, filters, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterKey, filterValue) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: filterValue
    };
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    onFilter({});
    onSearch('');
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchTerm;

  return (
    <div className="space-y-4 mb-8 wellness-card">
      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="search-input pl-14"
        />
        {searchTerm && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Options */}
      {filters && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-700">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700 font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          {filters.priceRange && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">💰 Price Range</label>
              <select
                value={activeFilters.priceRange || ''}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="input-field"
              >
                <option value="">All Prices</option>
                <option value="0-500">₹0 - ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="2000+">₹2000+</option>
              </select>
            </div>
          )}

          {/* Rating Filter */}
          {filters.rating && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">⭐ Minimum Rating</label>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('minRating', rating)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeFilters.minRating === rating
                        ? 'bg-yellow-400 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 hover:bg-yellow-50'
                    }`}
                  >
                    {rating}⭐
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verification Filter */}
          {filters.verified && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">✓ Verification</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('verified', true)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeFilters.verified === true
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 hover:bg-green-50'
                  }`}
                >
                  ✓ Verified Only
                </button>
                <button
                  onClick={() => handleFilterChange('verified', null)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeFilters.verified === null
                      ? 'bg-gray-500 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          )}

          {/* Availability Filter */}
          {filters.availability && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">📅 Availability</label>
              <select
                value={activeFilters.availability || ''}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="input-field"
              >
                <option value="">All</option>
                <option value="today">Available Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
          )}

          {/* Sort By */}
          {filters.sortBy && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">🔄 Sort By</label>
              <select
                value={activeFilters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field"
              >
                <option value="">Default</option>
                <option value="rating-high">Rating: High to Low</option>
                <option value="rating-low">Rating: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <span className="text-sm font-semibold text-gray-600">Active:</span>
          {searchTerm && (
            <span className="badge-success">
              Search: "{searchTerm}"
            </span>
          )}
          {Object.entries(activeFilters).map(([key, value]) => (
            value && (
              <span key={key} className="badge-warning">
                {key}: {value.toString()}
              </span>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
