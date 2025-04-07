import { useState } from "react";
import axios from "axios";

const InquiryForm = ({ propertyId, token }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !inquiry) return;

    try {
      setLoading(true);
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
        }
      );

      setMsg("Inquiry sent!");
      setName("");
      setPhone("");
      setInquiry("");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded mt-8 shadow-sm">
      <h3 className="text-lg font-semibold">Send Inquiry</h3>

      {msg && <p className="text-green-600">{msg}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Your name"
        className="w-full border rounded px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Phone number"
        className="w-full border rounded px-3 py-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <textarea
        placeholder="Your message..."
        className="w-full border rounded px-3 py-2"
        rows={4}
        value={inquiry}
        onChange={(e) => setInquiry(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
};

export default InquiryForm;
