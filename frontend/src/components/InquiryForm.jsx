"use client"

import { useState } from "react"
import axios from "axios"
import { User, Phone, MessageSquare, Send, CheckCircle, AlertCircle, Loader } from "lucide-react"

const InquiryForm = ({ propertyId, token }) => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [inquiry, setInquiry] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !phone || !inquiry) return

    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:5000/api/inquiries",
        {
          name,
          phone,
          inquiry,
          propertyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setMsg("Inquiry sent! We'll get back to you as soon as possible.")
      setName("")
      setPhone("")
      setInquiry("")
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send inquiry. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Success Message */}
      {msg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <p>{msg}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-600 mb-2">
          Interested in this property? Fill out the form below to get in touch with the agent.
        </p>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              placeholder="John Doe"
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              placeholder="+1 (123) 456-7890"
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="inquiry" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="inquiry"
              placeholder="I'm interested in this property and would like to schedule a viewing..."
              className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Sending Inquiry...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Send Inquiry
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By submitting this form, you agree to our{" "}
          <a href="#" className="text-red-600 hover:text-red-800">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="text-red-600 hover:text-red-800">
            Terms of Service
          </a>
          .
        </p>
      </form>
    </div>
  )
}

export default InquiryForm
