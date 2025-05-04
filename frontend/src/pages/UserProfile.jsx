"use client"

import { useParams } from "react-router-dom"
import { useUserProperties } from "../hooks/useUserProperties"
import { useUserDetails } from "../hooks/useUserDetails"
import { useSelector } from "react-redux"
import { useState } from "react"
import { useUserReviews } from "../hooks/useUserReviews"
import ReviewForm from "../components/ReviewForm"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
} from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

const UserProfile = () => {
  const { userId } = useParams()
  const token = useSelector((state) => state.auth.accessToken)
  const authUser = useSelector((state) => state.auth.user.id)

  const [page, setPage] = useState(1)

  const { user, loading: userLoading, error: userError } = useUserDetails(userId, token)
  const {
    properties,
    meta,
    loading: propertiesLoading,
    error: propertiesError,
  } = useUserProperties(userId, token, page)

  const { reviews, loading: reviewsLoading, error: reviewsError } = useUserReviews(userId, token)

  // Function to format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0"
  }

  // Function to calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0
    const sum = reviews.reduce((total, review) => total + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  // Function to generate star rating display
  const renderStarRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>,
        )
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />)
      }
    }

    return stars
  }

  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Agent Profile</h1>
          <p className="text-gray-300">View agent details, listings, and reviews</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Info Section */}
        {userLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-red-600 animate-spin mr-3" />
            <span className="text-gray-600">Loading user information...</span>
          </div>
        ) : userError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span>{userError}</span>
          </div>
        ) : user ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* User Avatar */}
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-12 w-12 text-red-600" />
              </div>

              {/* User Details */}
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {renderStarRating(calculateAverageRating())}
                    <span className="ml-2 text-gray-600">
                      {calculateAverageRating()} ({reviews.length} reviews)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  {user.number && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{user.number}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Home className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{meta?.total || 0} Properties Listed</span>
                  </div>
                </div>
              </div>

              {/* Contact Button (only show if viewing someone else's profile) */}
              {authUser !== userId && (
                <div className="flex-shrink-0 w-full md:w-auto">
                  <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition-colors">
                    Contact Agent
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Listings Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Agent Listings</h2>
            {meta?.total > 0 && <span className="text-gray-600">{meta.total} properties</span>}
          </div>

          {propertiesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-red-600 animate-spin mr-3" />
              <span className="text-gray-600">Loading properties...</span>
            </div>
          ) : propertiesError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span>{propertiesError}</span>
            </div>
          ) : properties?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Link
                    to={`/properties/${property.slug}`}
                    key={property.slug}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <span className="text-white font-bold">${formatPrice(property.price)}</span>
                        {property.purpose === "rent" && <span className="text-white text-sm"> /month</span>}
                      </div>
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.purpose === "rent" ? "bg-blue-600" : "bg-red-600"
                          } text-white`}
                        >
                          {property.purpose === "rent" ? "For Rent" : "For Sale"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.city}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{property.bedrooms || 0} Beds</span>
                        <span>{property.bathrooms || 0} Baths</span>
                        <span>
                          {property.area?.value || 0} {property.area?.unit || "sqft"}
                        </span>
                      </div>
                    </div>
                  </Link>
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
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Properties Listed</h3>
              <p className="text-gray-500">This agent hasn't listed any properties yet.</p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

          {reviewsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 text-red-600 animate-spin mr-3" />
              <span className="text-gray-600">Loading reviews...</span>
            </div>
          ) : reviewsError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span>{reviewsError}</span>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4 mb-8">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">{renderStarRating(review.rating)}</div>
                    <span className="text-gray-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  {review.reviewer && (
                    <p className="text-sm text-gray-500 mt-2">- {review.reviewer.name || "Anonymous User"}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mb-8">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">Be the first to leave a review for this agent.</p>
            </div>
          )}

          {/* Review Form */}
          {authUser !== userId && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
              <ReviewForm brokerId={userId} token={token} />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default UserProfile
