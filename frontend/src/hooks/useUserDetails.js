// hooks/useUserDetails.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const useUserDetails = (userId, token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  return { user, loading, error };
};
