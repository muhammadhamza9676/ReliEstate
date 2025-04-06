// pages/PropertyList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../redux/slices/propertySlice";

const PropertyList = () => {
  const dispatch = useDispatch();
  const { properties, loading, error, meta } = useSelector((state) => state.property);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6; // Properties per page

  useEffect(() => {
    dispatch(fetchProperties({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (meta && currentPage < meta.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Property Listings</h2>

      {loading ? (
        <p className="text-center">Loading properties...</p>
      ) : error ? (
        <p className="text-red-500 text-center">Error: {error}</p>
      ) : properties.length === 0 ? (
        <p className="text-center">No properties found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div key={property._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                {property.images?.[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{property.location?.city}</p>
                  <p className="font-bold text-green-600">${property.price.toLocaleString()}</p>
                  <p className="text-sm mt-1">{property.purpose} • {property.type}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="font-medium">
              Page {currentPage} of {meta?.totalPages || 1}
            </span>
            <button
              onClick={handleNext}
              disabled={meta && currentPage >= meta.totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyList;
