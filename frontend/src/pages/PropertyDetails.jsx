"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { fetchPropertyBySlug } from "../redux/slices/propertySlice"
import InquiryForm from "../components/InquiryForm"
import {
  Home,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Calendar,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Loader,
} from "lucide-react"
import Navbar from "../components/Navbar"

const PropertyDetails = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { property, loading, error } = useSelector((state) => state.property)
  const user = useSelector((state) => state.auth)
  const token = user?.accessToken

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (slug) {
      dispatch(fetchPropertyBySlug(slug))
      // Reset active image when loading a new property
      setActiveImageIndex(0)
    }
  }, [slug, dispatch])

  // Function to format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0"
  }

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle image navigation
  const nextImage = () => {
    if (property?.images && activeImageIndex < property.images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1)
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <Loader className="h-12 w-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading property details...</p>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center max-w-md">
          <X className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-medium mb-4">{error}</p>
          <Link to="/browse" className="inline-flex items-center text-red-600 hover:text-red-800 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>
    )

  if (!property)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-6 py-8 rounded-lg text-center max-w-md">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium mb-4">No property found.</p>
          <Link to="/browse" className="inline-flex items-center text-red-600 hover:text-red-800 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>
    )

  const {
    title,
    description,
    price,
    type,
    purpose,
    area,
    bedrooms,
    bathrooms,
    location,
    images,
    postedBy,
    facilities,
    features,
    furnishing,
    tags,
    availabilityDate,
  } = property

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Back Navigation */}
        <div className="bg-gray-900">
          <div className="container mx-auto px-4 py-4">
            <Link
              to="/browse"
              className="inline-flex items-center text-white hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </div>
        </div>

        {/* Property Images Gallery */}
        <div className="bg-black relative">
          <div className="container mx-auto">
            <div className="relative h-[50vh] md:h-[60vh]">
              {images && images.length > 0 ? (
                <>
                  <img
                    src={images[activeImageIndex] || "/placeholder.svg"}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        disabled={activeImageIndex === 0}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        disabled={activeImageIndex === images.length - 1}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${index === activeImageIndex ? "bg-white" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property Title and Quick Info */}
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${purpose === "rent" ? "bg-blue-600" : "bg-red-600"
                      } text-white mr-2`}
                  >
                    {purpose === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
                    {type}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {location?.city}
                    {location?.state && `, ${location.state}`}
                    {location?.country && `, ${location.country}`}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  ${formatPrice(price)}
                  {purpose === "rent" && <span className="text-sm font-normal">/month</span>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isFavorite ? "fill-red-600 text-red-600" : "text-gray-600"}`} />
                    <span>{isFavorite ? "Saved" : "Save"}</span>
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Share2 className="h-5 w-5 mr-2 text-gray-600" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2">
              {/* Key Details */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
                  {bedrooms !== undefined && (
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-50 p-3 rounded-full mb-2">
                        <BedDouble className="h-6 w-6 text-red-600" />
                      </div>
                      <span className="text-sm text-gray-600">Bedrooms</span>
                      <span className="font-bold">{bedrooms}</span>
                    </div>
                  )}
                  {bathrooms !== undefined && (
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-50 p-3 rounded-full mb-2">
                        <Bath className="h-6 w-6 text-red-600" />
                      </div>
                      <span className="text-sm text-gray-600">Bathrooms</span>
                      <span className="font-bold">{bathrooms}</span>
                    </div>
                  )}
                  {area && (
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-50 p-3 rounded-full mb-2">
                        <Maximize className="h-6 w-6 text-red-600" />
                      </div>
                      <span className="text-sm text-gray-600">Area</span>
                      <span className="font-bold">
                        {area.value} {area.unit}
                      </span>
                    </div>
                  )}
                  {availabilityDate && (
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-50 p-3 rounded-full mb-2">
                        <Calendar className="h-6 w-6 text-red-600" />
                      </div>
                      <span className="text-sm text-gray-600">Available From</span>
                      <span className="font-bold">{formatDate(availabilityDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{description}</p>
              </div>

              {/* Features & Facilities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Features */}
                {features && Object.keys(features).length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">Features</h2>
                    <ul className="space-y-3">
                      {Object.entries(features).map(([key, val]) => (
                        <li key={key} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            <span className="font-medium capitalize">{key}:</span> {val}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Facilities */}
                {facilities && Object.keys(facilities).length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-4">Facilities</h2>
                    <ul className="space-y-3">
                      {Object.entries(facilities).map(
                        ([key, val]) =>
                          val && (
                            <li key={key} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 capitalize">{key}</span>
                            </li>
                          ),
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Map Placeholder */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Location</h2>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400 mr-2" />
                  <span className="text-gray-500">Map view coming soon</span>
                </div>
                <div className="mt-4 text-gray-700">
                  <p>
                    <strong>Address:</strong> {location?.address || "Address not provided"}
                  </p>
                  <p>
                    <strong>City:</strong> {location?.city || "City not provided"}
                  </p>
                  {location?.state && (
                    <p>
                      <strong>State:</strong> {location.state}
                    </p>
                  )}
                  {location?.country && (
                    <p>
                      <strong>Country:</strong> {location.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Contact & Inquiry */}
            <div className="lg:col-span-1">
              {/* Contact Info */}
              {postedBy && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <User className="h-8 w-8 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{postedBy.name}</h3>
                      <Link to={`/users/${postedBy._id}`} className="text-red-600 hover:text-red-800 text-sm font-medium">
                        View Profile
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <span>{postedBy.phone || "Phone not provided"}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-3" />
                      <span>{postedBy.email || "Email not provided"}</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <a
                      href={`tel:${postedBy.phone}`}
                      className="bg-red-600 text-white py-2 px-4 rounded-md text-center hover:bg-red-700 transition-colors"
                    >
                      Call Now
                    </a>
                    <a
                      href={`mailto:${postedBy.email}`}
                      className="bg-black text-white py-2 px-4 rounded-md text-center hover:bg-gray-800 transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </div>
              )}

              {/* Inquiry Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Send an Inquiry</h2>
                {property && <InquiryForm propertyId={property._id} token={token} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PropertyDetails
