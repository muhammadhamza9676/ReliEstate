// import { useSelector } from "react-redux";
// import { useState } from "react";
// import { useMyInquiries } from "../hooks/useMyInquiries";

// const MyInquiries = () => {
//     const user = useSelector((state) => state.auth);
//     const token = user?.accessToken;
//   const [page, setPage] = useState(1);

//   const { inquiries, meta, loading, error } = useMyInquiries(token, page);

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">My Inquiries</h1>

//       {loading && <p>Loading inquiries...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="space-y-4">
//         {inquiries.map((inq) => (
//           <div key={inq._id} className="border rounded p-4 shadow">
//             <h2 className="font-semibold text-lg">{inq.name}</h2>
//             <p className="text-sm text-gray-600">{inq.phone}</p>
//             <p className="text-gray-800 mt-2">{inq.inquiry}</p>
//             <p className="text-sm mt-2">
//               For:{" "}
//               <a
//                 href={`/properties/${inq.property.slug}`}
//                 className="text-blue-600 underline"
//               >
//                 {inq.property.title}
//               </a>
//             </p>
//             <p className="text-xs text-gray-400">
//               {new Date(inq.createdAt).toLocaleDateString()}
//             </p>
//           </div>
//         ))}
//       </div>

//       {meta.totalPages > 1 && (
//         <div className="flex gap-2 mt-6">
//           {Array.from({ length: meta.totalPages }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => setPage(i + 1)}
//               className={`px-3 py-1 border rounded ${
//                 page === i + 1 ? "bg-blue-500 text-white" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyInquiries;






"use client"

import { useSelector } from "react-redux"
import { useState } from "react"
import { useMyInquiries } from "../hooks/useMyInquiries"
import { Link } from "react-router-dom"
import {
  MessageSquare,
  Phone,
  Calendar,
  Home,
  User,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
  Inbox,
} from "lucide-react"

const MyInquiries = () => {
  const user = useSelector((state) => state.auth)
  const token = user?.accessToken
  const [page, setPage] = useState(1)

  const { inquiries, meta, loading, error } = useMyInquiries(token, page)

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Inquiries</h1>
          <p className="text-gray-300">View and manage inquiries about your properties</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-red-600 animate-spin mr-3" />
            <span className="text-gray-600">Loading inquiries...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && inquiries.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Inbox className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Inquiries Yet</h3>
            <p className="text-gray-500 mb-6">You haven't received any inquiries about your properties yet.</p>
            <Link
              to="/properties"
              className="inline-flex items-center justify-center px-5 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}

        {/* Inquiries List */}
        {!loading && !error && inquiries.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {inquiries.map((inq) => (
                <div key={inq._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-center mb-2 md:mb-0">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h2 className="font-bold text-lg">{inq.name}</h2>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-1" />
                            <span className="text-sm">{inq.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(inq.createdAt)}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="flex items-start mb-2">
                        <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <h3 className="font-medium">Inquiry Message</h3>
                      </div>
                      <p className="text-gray-700 pl-7">{inq.inquiry}</p>
                    </div>

                    <div className="flex items-start">
                      <Home className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Property</h3>
                        <Link
                          to={`/properties/${inq.property.slug}`}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          {inq.property.title}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-3 border-t flex justify-end">
                    <a
                      href={`tel:${inq.phone}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Back
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta?.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                    // Logic to show current page and surrounding pages
                    let pageNum
                    if (meta.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= meta.totalPages - 2) {
                      pageNum = meta.totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 mx-1 rounded-md flex items-center justify-center ${
                          page === pageNum
                            ? "bg-red-600 text-white"
                            : "border border-gray-300 hover:bg-gray-100 transition-colors"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                  disabled={page === meta.totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MyInquiries;
