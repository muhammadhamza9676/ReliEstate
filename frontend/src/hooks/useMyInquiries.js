import { useEffect, useState } from "react";
import axios from "axios";

export const useMyInquiries = (token, page = 1, limit = 10) => {
  const [inquiries, setInquiries] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchInquiries = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/inquiries/me?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInquiries(res.data.data);
        setMeta(res.data.meta);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch inquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [token, page, limit]);

  return { inquiries, meta, loading, error };
};
