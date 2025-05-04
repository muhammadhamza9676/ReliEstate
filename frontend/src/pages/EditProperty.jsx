
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchPropertyBySlug, updateProperty, clearPropertyState } from "../redux/slices/propertySlice"
import { Loader, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import PropertyForm from "../components/PropertyForm"
import Navbar from "../components/Navbar";


const EditProperty = () => {
  const { id } = useParams();
  console.log("SLug is", id);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { accessToken } = useSelector((state) => state.auth)
  const { property:propertyDetails, loading, success, error } = useSelector((state) => state.property)
  console.log(propertyDetails)
  const [form, setForm] = useState(null)
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])

  useEffect(() => {
    if (id) dispatch(fetchPropertyBySlug(id))
    return () => dispatch(clearPropertyState())
  }, [dispatch, id])

  useEffect(() => {
    console.log("1")
    if (propertyDetails) {
      console.log("2")
      setForm({
        title: propertyDetails.title,
        description: propertyDetails.description,
        price: propertyDetails.price,
        purpose: propertyDetails.purpose,
        type: propertyDetails.type,
        areaValue: propertyDetails.area?.value || "",
        areaUnit: propertyDetails.area?.unit || "sqft",
        city: propertyDetails.location?.city || "",
        bedrooms: propertyDetails.bedrooms || "",
        bathrooms: propertyDetails.bathrooms || "",
      })
      console.log("3")
      if (propertyDetails.images && Array.isArray(propertyDetails.images)) {
        setPreviewImages(propertyDetails.images.map((img) => img.url || img))
      }
    }
  }, [propertyDetails])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const files = [...e.target.files]
    setImages(files)
    const previews = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(previews)
  }

  const removeImage = (idx) => {
    const newPreviews = [...previewImages]
    const newImages = [...images]
    newPreviews.splice(idx, 1)
    newImages.splice(idx, 1)
    setPreviewImages(newPreviews)
    setImages(newImages)
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
    if (form.bedrooms) formData.append("bedrooms", form.bedrooms)
    if (form.bathrooms) formData.append("bathrooms", form.bathrooms)
    images.forEach((img) => formData.append("images", img))

    dispatch(updateProperty({ id: propertyDetails?._id, formData, token: accessToken }))
  }

  if (!form) return <div className="p-6 text-center">Loading property...</div>

  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Property</h1>
          <p className="text-gray-300">Update your listing's details and media</p>
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
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Property Updated Successfully!</p>
                  <p className="text-green-700 mt-1">Your property details have been updated.</p>
                </div>
              </div>
            </div>
          )}

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

          <PropertyForm
            form={form}
            onChange={handleChange}
            images={images}
            previewImages={previewImages}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            loading={loading}
            isEdit
            removeImage={removeImage}
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default EditProperty
