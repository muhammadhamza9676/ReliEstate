import { useState, useEffect } from "react";
import axios from "axios";

export const useUserReviews = (userId, token, page = 1, limit = 10) => {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}/reviews?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReviews(res.data.data);
        setMeta(res.data.meta);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId, token, page, limit]);

  return { reviews, meta, loading, error };
};
