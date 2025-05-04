
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { useUserDetails } from "../hooks/useUserDetails"
import {
  User,
  Mail,
  Phone,
  Building,
  Award,
  CreditCard,
  Loader,
  CheckCircle,
  AlertCircle,
  Save,
  ArrowLeft,
} from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

const EditProfile = () => {
  const userData = useSelector((state) => state.auth)
  const token = userData?.accessToken
  const userId = userData?.user?.id

  const { user, loading, error } = useUserDetails(userId, token)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    brokerInfo: {
      experience: "",
      agencyName: "",
      licenseNumber: "",
    },
  })

  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        brokerInfo: {
          experience: user.brokerInfo?.experience || "",
          agencyName: user.brokerInfo?.agencyName || "",
          licenseNumber: user.brokerInfo?.licenseNumber || "",
        },
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (["experience", "agencyName", "licenseNumber"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        brokerInfo: {
          ...prev.brokerInfo,
          [name]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    try {
      await axios.put("http://localhost:5000/api/users/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSuccessMsg("Your profile has been updated successfully!")
      window.scrollTo(0, 0)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile. Please try again.")
      window.scrollTo(0, 0)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Profile</h1>
          <p className="text-gray-300">Update your personal information and broker details</p>
          {/* Back Link */}
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-100 hover:text-red-600 transition-colors mt-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm">
              <Loader className="h-8 w-8 text-red-600 animate-spin mr-3" />
              <span className="text-gray-600">Loading your profile information...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Success Message */}
              {successMsg && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-green-800">{successMsg}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                    <div>
                      <p className="font-medium text-red-800">Error</p>
                      <p className="text-red-700 mt-1">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Personal Information */}
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4 pb-2 border-b">Personal Information</h2>
                  </div>

                  {/* Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        value={formData.email}
                        className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Broker Information */}
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4 pb-2 border-b">Broker Information</h2>
                    <p className="text-gray-600 mb-4">
                      Complete this information if you're a real estate broker or agent
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Experience (years)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Award className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        placeholder="Years of experience"
                        value={formData.brokerInfo.experience}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Agency Name */}
                  <div>
                    <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Agency Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="agencyName"
                        name="agencyName"
                        type="text"
                        placeholder="Your agency name"
                        value={formData.brokerInfo.agencyName}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* License Number */}
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        placeholder="Your license number"
                        value={formData.brokerInfo.licenseNumber}
                        onChange={handleChange}
                        className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default EditProfile;
