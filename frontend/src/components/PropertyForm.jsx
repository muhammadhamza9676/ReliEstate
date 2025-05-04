"use client"

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
  Building,
} from "lucide-react"

const PropertyForm = ({
  form,
  onChange,
  images,
  previewImages,
  onFileChange,
  onSubmit,
  loading,
  isEdit = false,
  removeImage
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Basic Information</h2>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Home className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              type="text"
              placeholder="e.g. Modern 3 Bedroom House with Garden"
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <div className="absolute top-3 left-3">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Describe your property in detail..."
              rows={4}
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              type="number"
              placeholder="e.g. 250000"
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
          <select
            name="purpose"
            value={form.purpose}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Property Details</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <select
              name="type"
              value={form.type}
              onChange={onChange}
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              type="text"
              placeholder="e.g. New York"
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Maximize className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="areaValue"
              value={form.areaValue}
              onChange={onChange}
              type="number"
              placeholder="e.g. 1500"
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area Unit</label>
          <select
            name="areaUnit"
            value={form.areaUnit}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
          >
            <option value="sqft">Square Feet</option>
            <option value="sqm">Square Meters</option>
            <option value="marla">Marla</option>
            <option value="kanal">Kanal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms (optional)</label>
          <input
            name="bedrooms"
            value={form.bedrooms}
            onChange={onChange}
            type="number"
            placeholder="e.g. 3"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms (optional)</label>
          <input
            name="bathrooms"
            value={form.bathrooms}
            onChange={onChange}
            type="number"
            placeholder="e.g. 2"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Property Images</h2>
          <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300">
            <div className="flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-700 mb-2">Drag and drop your images here, or</p>
              <label
                htmlFor="images"
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Browse Files
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Upload up to 10 images (Max 5MB each)</p>
            </div>
          </div>

          {previewImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected Images ({previewImages.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewImages.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded overflow-hidden bg-gray-100 group">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              {isEdit ? "Updating Property..." : "Uploading Property..."}
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              {isEdit ? "Update Property" : "List Property"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default PropertyForm
