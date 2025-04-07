import { useSelector } from "react-redux";
import { useState } from "react";
import { useMyInquiries } from "../hooks/useMyInquiries";

const MyInquiries = () => {
    const user = useSelector((state) => state.auth);
    const token = user?.accessToken;
  const [page, setPage] = useState(1);

  const { inquiries, meta, loading, error } = useMyInquiries(token, page);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Inquiries</h1>

      {loading && <p>Loading inquiries...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq._id} className="border rounded p-4 shadow">
            <h2 className="font-semibold text-lg">{inq.name}</h2>
            <p className="text-sm text-gray-600">{inq.phone}</p>
            <p className="text-gray-800 mt-2">{inq.inquiry}</p>
            <p className="text-sm mt-2">
              For:{" "}
              <a
                href={`/properties/${inq.property.slug}`}
                className="text-blue-600 underline"
              >
                {inq.property.title}
              </a>
            </p>
            <p className="text-xs text-gray-400">
              {new Date(inq.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInquiries;
