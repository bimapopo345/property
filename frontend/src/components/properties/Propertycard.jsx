import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  IndianRupee, 
  BedDouble, 
  Bath, 
  Maximize,
  Share2,
  Tag
} from 'lucide-react';

const PropertyCard = ({ property, viewType }) => {
  const isGrid = viewType === 'grid';
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/properties/single/${property._id}`);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white rounded-xl overflow-hidden cursor-pointer
        hover:shadow-xl transition-all duration-300 
        ${isGrid ? 'flex flex-col' : 'flex flex-row gap-6'}`}
      onClick={handleViewDetails}
    >
      {/* Image Section */}
      <div className={`relative ${isGrid ? 'h-64' : 'w-96'} overflow-hidden`}>
        <motion.img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500"
          whileHover={{ scale: 1.1 }}
        />
        
        {/* Property Status Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            {property.type}
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            {property.availability}
          </motion.span>
        </div>

        {/* Share Button */}
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          animate={{ opacity: 1 }}
          onClick={handleShare}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full
            hover:bg-blue-50 transition-colors shadow-lg"
          aria-label="Share property"
        >
          <Share2 className="w-4 h-4 text-gray-700" />
        </motion.button>
      </div>

      {/* Content Section */}
      <div className={`flex-1 p-6 ${isGrid ? '' : 'flex flex-col justify-between'}`}>
        <div>
          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            {property.location}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2 
            group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-6">
            <Tag className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              ₹{Number(property.price).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
            <BedDouble className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
            <Bath className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
            <Maximize className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">{property.sqft} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;