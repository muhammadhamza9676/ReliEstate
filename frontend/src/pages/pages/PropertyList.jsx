"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchProperties } from "../redux/slices/propertySlice"
import {
  Home,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Heart,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader,
} from "lucide-react"

const PropertyList = () => {
  const dispatch = useDispatch()
  const { properties, loading, error, meta } = useSelector((state) => state.property)

  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState([])
  const limit = 6 // or whatever you prefer

  useEffect(() => {
    dispatch(fetchProperties({ page, limit }))
  }, [dispatch, page])

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (meta?.totalPages && page < meta.totalPages) setPage((prev) => prev + 1)
  }

  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter((id) => id !== propertyId))
    } else {
      setFavorites([...favorites, propertyId])
    }
  }

  // Function to format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Property</h1>
          <p className="text-gray-300 mb-8 max-w-2xl">
            Browse through our extensive collection of properties for sale and rent. Find the perfect home that matches
            your lifestyle and preferences.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by location, property type, or keyword"
                className="pl-10 w-full py-3 px-4 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {meta?.total ? `${meta.total} Properties Available` : "Property Listings"}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center">
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={() => dispatch(fetchProperties({ page, limit }))}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {properties.length === 0 ? (
              <div className="text-center py-20">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No properties found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <div
                    key={property.slug}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Property Image */}
                    <div className="relative">
                      <img
                        src={property.image || "/no-image.png"}
                        alt={property.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50"></div>

                      {/* Property Purpose Tag */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${property.purpose === "rent" ? "bg-blue-600" : "bg-red-600"} text-white`}
                        >
                          {property.purpose === "rent" ? "For Rent" : "For Sale"}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(property.slug)}
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.includes(property.slug) ? "fill-red-600 text-red-600" : "text-gray-700"}`}
                        />
                      </button>

                      {/* Price Tag */}
                      <div className="absolute bottom-4 left-4">
                        <span className="text-white text-xl font-bold">
                          ${formatPrice(property.price)}
                          {property.purpose === "rent" && <span className="text-sm font-normal">/month</span>}
                        </span>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1 line-clamp-1">{property.title}</h3>
                          <div className="flex items-center text-gray-500 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.city}</span>
                          </div>
                        </div>
                        <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700 capitalize">
                          {property.type}
                        </div>
                      </div>

                      {/* Property Features */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-gray-700">
                          <BedDouble className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.bedrooms || 3} Beds</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Bath className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.bathrooms || 2} Baths</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Maximize className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.area || 1200} sqft</span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/properties/${property.slug}`}
                        className="mt-5 w-full inline-block text-center py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta?.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={handlePrev}
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
                  onClick={handleNext}
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

export default PropertyList
