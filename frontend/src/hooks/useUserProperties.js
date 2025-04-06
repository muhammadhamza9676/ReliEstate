import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/properties/user";

export const useUserProperties = (userId, token, page = 1, limit = 10) => {
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !token) return; // Remove ??

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${API_URL}?userId=${userId}&page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProperties(res.data.data || []);
        setMeta(res.data.meta || { totalPages: 1 });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch properties");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token, page, limit]);

  return { properties, meta, loading, error };
};
