import React, { useState } from 'react';
import { Home, DollarSign, BedDouble, Bath, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';

const propertyTypes = ['House', 'Apartment', 'Villa', 'Office'];
const availabilityTypes = ['Rent', 'Buy', 'Lease'];

const FilterSection = ({ onApplyFilters, isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: 0,
    bedrooms: '0',
    bathrooms: '0',
    availability: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      propertyType: '',
      priceRange: 0,
      bedrooms: '0',
      bathrooms: '0',
      availability: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Property Type */}
        <div className="filter-group">
          <label className="filter-label">
            <Home className="w-4 h-4 mr-2" />
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleChange({ target: { name: 'propertyType', value: type.toLowerCase() } })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filters.propertyType === type.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label">
            <DollarSign className="w-4 h-4 mr-2" />
            Price Range
          </label>
          <input
            type="range"
            name="priceRange"
            min="0"
            max="1000000"
            step="10000"
            value={filters.priceRange}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-sm mt-2">
            <span className="font-medium">$0</span>
            <span className="font-medium">${Number(filters.priceRange).toLocaleString()}</span>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          {['bedrooms', 'bathrooms'].map((type) => (
            <div key={type} className="filter-group">
              <label className="filter-label">
                {type === 'bedrooms' ? <BedDouble className="w-4 h-4 mr-2" /> : <Bath className="w-4 h-4 mr-2" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, '4+'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleChange({ target: { name: type, value: num.toString() } })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                      ${filters[type] === num.toString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        

        {/* Availability */}
        <div className="filter-group">
          <label className="filter-label">Availability</label>
          <div className="flex space-x-2">
            {availabilityTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleChange({ target: { name: 'availability', value: type.toLowerCase() } })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                  ${filters.availability === type.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-8">
        <button
          onClick={handleApplyFilters}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
            transition-colors font-medium"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
};

export default FilterSection;