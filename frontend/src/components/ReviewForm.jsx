"use client"

import { useState } from "react"
import axios from "axios"
import { Star, Loader, CheckCircle, AlertCircle } from "lucide-react"

const ReviewForm = ({ brokerId, token, onReviewAdded }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating || !comment) return

    try {
      setLoading(true)
      const res = await axios.post(
        `http://localhost:5000/api/users/${brokerId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setSuccessMsg("Your review has been submitted successfully!")
      setComment("")
      setRating(5)
      setError(null)

      onReviewAdded?.(res.data.review) // Optional callback to update review list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Success Message */}
      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
          <div className="flex items-center" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating === 1
                ? "Poor"
                : rating === 2
                  ? "Fair"
                  : rating === 3
                    ? "Good"
                    : rating === 4
                      ? "Very Good"
                      : "Excellent"}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this agent..."
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your review will help others make informed decisions. Please be honest and constructive.
        </p>
      </form>
    </div>
  )
}

export default ReviewForm;
