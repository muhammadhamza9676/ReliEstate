"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addProperty, clearPropertyState } from "../redux/slices/propertySlice"
import {
  Home,
  DollarSign,
  MapPin,
  Maximize,
  FileText,
  Upload,
  ImageIcon,
  Plus,
  Loader,
  CheckCircle,
  AlertCircle,
  Building,
} from "lucide-react"

const AddProperty = () => {
  const dispatch = useDispatch()
  const { accessToken } = useSelector((state) => state.auth)
  const { loading, success, error } = useSelector((state) => state.property)

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    purpose: "sale",
    type: "house",
    areaValue: "",
    areaUnit: "sqft",
    city: "",
    bedrooms: "",
    bathrooms: "",
  })

  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    return () => dispatch(clearPropertyState())
  }, [dispatch])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = [...e.target.files]
    setImages(files)

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(previews)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = [...e.dataTransfer.files]
      setImages(files)

      // Create preview URLs
      const previews = files.map((file) => URL.createObjectURL(file))
      setPreviewImages(previews)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", form.title)
    formData.append("description", form.description)
    formData.append("price", form.price)
    formData.append("purpose", form.purpose)
    formData.append("type", form.type)
    formData.append("area", JSON.stringify({ value: Number(form.areaValue), unit: form.areaUnit }))
    formData.append("location", JSON.stringify({ city: form.city }))

    // Add optional fields if they exist
    if (form.bedrooms) formData.append("bedrooms", form.bedrooms)
    if (form.bathrooms) formData.append("bathrooms", form.bathrooms)

    images.forEach((img) => formData.append("images", img))

    dispatch(addProperty({ formData, token: accessToken }))
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Add New Property</h1>
          <p className="text-gray-300">List your property for sale or rent</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Property Added Successfully!</p>
                  <p className="text-green-700 mt-1">
                    Your property has been listed and is now visible to potential buyers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">Basic Information</h2>
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Modern 3 Bedroom House with Garden"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your property in detail..."
                    rows={4}
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="e.g. 250000"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              {/* Property Details */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">Property Details</h2>
              </div>

              {/* Property Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="e.g. New York"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Area */}
              <div>
                <label htmlFor="areaValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Area
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Maximize className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="areaValue"
                    name="areaValue"
                    type="number"
                    placeholder="e.g. 1500"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Area Unit */}
              <div>
                <label htmlFor="areaUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Area Unit
                </label>
                <select
                  id="areaUnit"
                  name="areaUnit"
                  value={form.areaUnit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="sqft">Square Feet (sqft)</option>
                  <option value="sqm">Square Meters (sqm)</option>
                  <option value="marla">Marla</option>
                  <option value="kanal">Kanal</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms (optional)
                </label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="e.g. 3"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onChange={handleChange}
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms (optional)
                </label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="e.g. 2"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  onChange={handleChange}
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b">Property Images</h2>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    dragActive ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-700 mb-2">Drag and drop your images here, or</p>
                    <label
                      htmlFor="images"
                      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors inline-flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Files
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Upload up to 10 images (Max 5MB each)</p>
                  </div>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Selected Images ({previewImages.length})</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                          <ImageIcon
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Uploading Property...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    List Property
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProperty;
