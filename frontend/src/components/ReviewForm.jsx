import { useState } from "react";
import axios from "axios";

const ReviewForm = ({ brokerId, token, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/users/${brokerId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg("Review submitted!");
      setComment("");
      setRating(5);
      setError(null);

      onReviewAdded?.(res.data.review); // Optional callback to update review list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded mt-6">
      <h3 className="text-lg font-semibold">Leave a Review</h3>

      {error && <p className="text-red-500">{error}</p>}
      {successMsg && <p className="text-green-500">{successMsg}</p>}

      <div>
        <label className="block mb-1 font-medium">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>{num} Star{num !== 1 && "s"}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
