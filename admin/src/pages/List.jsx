import React, { useState, useEffect } from "react";
import { Trash2, Edit3 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { backendurl } from "../App";

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/products/list`);
      if (response.data.success) {
        setProperties(response.data.property);
      } else {
        toast.error(response.data.error);
      }
      if (
        property.amenities &&
        Array.isArray(property.amenities) &&
        property.amenities.length > 0 &&
        typeof property.amenities[0] === "string"
      ) {
        try {
          property.amenities = JSON.parse(
            property.amenities[0].replace(/'/g, '"')
          );
        } catch (error) {
          console.error("Error parsing amenities:", error);
          property.amenities = [];
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []); // Empty dependency array to prevent infinite loops

  const handleRemoveProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to remove this property?")) {
      try {
        const response = await axios.post(`${backendurl}/api/products/remove`, {
          id: propertyId,
        });

        if (response.data.success) {
          toast.success(response.data.message);
          await fetchProperties(); // Refresh the list
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="pt-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Property Listings
            </h1>
            <p className="text-gray-500">
              {properties.length} Properties Found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Property Image */}
                <div className="relative h-48">
                  <img
                    src={
                      property.image && property.image.length > 0
                        ? property.image[0]
                        : "/api/placeholder/400/300"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => handleRemoveProperty(property._id)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >Delete
                      
                    </button>
                    <Link to={`/update/${property._id}`}>
                      <button className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200">
                        Update
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {property.title}
                    </h2>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {property.availability}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-2">
                    {property.location}
                  </p>

                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    ${property.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">{property.beds}</span>
                      <span className="text-gray-400">beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">{property.baths}</span>
                      <span className="text-gray-400">baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">
                        {property.sqft.toLocaleString()}
                      </span>
                      <span className="text-gray-400">sqft</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="text-gray-600 text-sm">
                    {Array.isArray(property.amenities) &&
                    property.amenities.length > 0 ? (
                      property.amenities.slice(0, 4).join(", ")
                    ) : (
                      <p className="text-gray-500">No amenities available</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No properties found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;
