// // pages/PropertyList.jsx
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProperties } from "../redux/slices/propertySlice";

// const PropertyList = () => {
//   const dispatch = useDispatch();
//   const { properties, loading, error, meta } = useSelector((state) => state.property);

//   const [currentPage, setCurrentPage] = useState(1);
//   const limit = 6; // Properties per page

//   useEffect(() => {
//     dispatch(fetchProperties({ page: currentPage, limit }));
//   }, [dispatch, currentPage]);

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (meta && currentPage < meta.totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold mb-6">Property Listings</h2>

//       {loading ? (
//         <p className="text-center">Loading properties...</p>
//       ) : error ? (
//         <p className="text-red-500 text-center">Error: {error}</p>
//       ) : properties.length === 0 ? (
//         <p className="text-center">No properties found.</p>
//       ) : (
//         <>
//           <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//             {properties.map((property) => (
//               <div key={property._id} className="bg-white shadow-md rounded-lg overflow-hidden">
//                 {property.images?.[0] && (
//                   <img
//                     src={property.images[0]}
//                     alt={property.title}
//                     className="w-full h-48 object-cover"
//                   />
//                 )}
//                 <div className="p-4">
//                   <h3 className="text-xl font-semibold">{property.title}</h3>
//                   <p className="text-sm text-gray-600 mb-2">{property.location?.city}</p>
//                   <p className="font-bold text-green-600">${property.price.toLocaleString()}</p>
//                   <p className="text-sm mt-1">{property.purpose} • {property.type}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-center items-center gap-4 mt-8">
//             <button
//               onClick={handlePrev}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <span className="font-medium">
//               Page {currentPage} of {meta?.totalPages || 1}
//             </span>
//             <button
//               onClick={handleNext}
//               disabled={meta && currentPage >= meta.totalPages}
//               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PropertyList;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProperties } from "../redux/slices/propertySlice";

const PropertyList = () => {
  const dispatch = useDispatch();
  const { properties, loading, error, meta } = useSelector((state) => state.property);

  const [page, setPage] = useState(1);
  const limit = 6; // or whatever you prefer

  useEffect(() => {
    dispatch(fetchProperties({ page, limit }));
  }, [dispatch, page]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (meta?.totalPages && page < meta.totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Property Listings</h2>

      {loading ? (
        <p>Loading properties...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {properties.map((property) => (
              <div key={property.slug} className="border rounded p-4 shadow-md">
                <img
                  src={property.image || "/no-image.png"}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600 capitalize">
                  {property.type} • {property.purpose}
                </p>
                <p className="font-bold text-green-700">${property.price}</p>
                <p className="text-sm text-gray-500">{property.city}</p>
                <Link
                  to={`/properties/${property.slug}`}
                  className="text-blue-500 underline mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-medium">
                Page {page} of {meta.totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page === meta.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyList;
