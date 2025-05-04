import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"
import { deleteProperty } from "../redux/slices/propertySlice"
import { useUserProperties } from "../hooks/useUserProperties"
import {
  Search,
  PlusCircle,
  MessageSquare,
  UserCog,
  Home,
  Trash2,
  Pencil,
  Loader,
  AlertCircle,
  MapPin,
  DollarSign,
  LayoutDashboard,
} from "lucide-react"

const Dashboard = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth)
  const user = userData?.user
  const token = userData?.accessToken

  const [page, setPage] = useState(1)
  const limit = 100
  const [refreshKey, setRefreshKey] = useState(0)
  const [isDeleting, setIsDeleting] = useState(null)

  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?")
    if (confirmDelete) {
      try {
        setIsDeleting(propertyId)
        await dispatch(deleteProperty({ id: propertyId, token })).unwrap()
        setRefreshKey((prev) => prev + 1) // Trigger hook rerun
      } catch (err) {
        alert("Failed to delete property: " + err.message)
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const { properties, meta, loading, error } = useUserProperties(user?.id, token, page, limit + refreshKey)

  // Function to format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0"
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pb-16">
        {/* Header */}
        <div className="bg-gray-900 text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Dashboard</h1>
            <p className="text-white text-center">Welcome, {user ? user.name : "Guest"}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Main Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {/* Card 1: Browse Listings */}
            <div className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:shadow-md hover:-translate-y-1 border-t-4 border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Search className="text-red-600 h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Browse Listings</h2>
              </div>
              <p className="text-gray-600 mb-6">Find the perfect property that matches your needs.</p>
              <Link to="/browse" className="text-red-600 hover:text-red-800 font-medium flex items-center">
                See Listings
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Card 2: Add Property */}
            <div className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:shadow-md hover:-translate-y-1 border-t-4 border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <PlusCircle className="text-red-600 h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Add Property</h2>
              </div>
              <p className="text-gray-600 mb-6">List your property for sale or rent on our platform.</p>
              <Link to="/add-property" className="text-red-600 hover:text-red-800 font-medium flex items-center">
                Add Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Card 3: My Inquiries */}
            <div className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:shadow-md hover:-translate-y-1 border-t-4 border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <MessageSquare className="text-red-600 h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">My Inquiries</h2>
              </div>
              <p className="text-gray-600 mb-6">Manage inquiries about your listed properties.</p>
              <Link to="/inquiries" className="text-red-600 hover:text-red-800 font-medium flex items-center">
                View Inquiries
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Card 4: Admin Dashboard (conditional) */}
            {user?.role === "admin" && (
              <div className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:shadow-md hover:-translate-y-1 border-t-4 border-red-600">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <LayoutDashboard className="text-red-600 h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Admin Dashboard</h2>
                </div>
                <p className="text-gray-600 mb-6">Manage listings and view platform insights.</p>
                <Link to="/admin/dashboard" className="text-red-600 hover:text-red-800 font-medium flex items-center">
                  View Dashboard
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* My Properties Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 pb-2">My Properties</h2>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="h-8 w-8 text-red-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading your properties...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span>{error}</span>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Home className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Properties Listed</h3>
                <p className="text-gray-500 mb-6">You haven't listed any properties yet.</p>
                <Link
                  to="/add-property"
                  className="inline-flex items-center justify-center px-5 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={property.image || "/placeholder.svg?height=200&width=400"}
                        alt={property.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute top-0 left-0 m-2">
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
                      <div className="flex items-center text-gray-900 font-bold mb-4">
                        <DollarSign className="h-5 w-5 text-red-600" />
                        <span>{formatPrice(property.price)}</span>
                        {property.purpose === "rent" && <span className="text-sm font-normal ml-1">/month</span>}
                      </div>

                      <div className="flex justify-between mt-4">
                        <Link
                          to={`/properties/${property.slug}`}
                          className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <div className="flex gap-2">
                          <Link
                            to={`/edit-property/${property.slug}`}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id)}
                            disabled={isDeleting === property.id}
                            className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting === property.id ? (
                              <Loader className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;
