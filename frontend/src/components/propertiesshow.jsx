import React from "react";
import { property } from '../assets/properties.js';
import { MapPin, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyCard = ({ property, onViewDetails }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-64">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          {property.location}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600 font-semibold">
            <IndianRupee className="h-4 w-4 mr-1" />
            {property.price}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PropertiesShow = ({ onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600">Handpicked properties for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {property.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertiesShow;
