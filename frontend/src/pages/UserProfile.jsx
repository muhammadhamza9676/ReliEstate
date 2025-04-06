import { useParams } from "react-router-dom";
import { useUserProperties } from "../hooks/useUserProperties";
import { useUserDetails } from "../hooks/useUserDetails";
import { useSelector } from "react-redux";
import { useState } from "react";

const UserProfile = () => {
  const { userId } = useParams();
  const token = useSelector((state) => state.auth.accessToken);

  const [page, setPage] = useState(1);

  const { user, loading: userLoading, error: userError } = useUserDetails(userId, token);
  const {
    properties,
    meta,
    loading: propertiesLoading,
    error: propertiesError,
  } = useUserProperties(userId, token, page);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">User Profile</h1>

      {userLoading && <p>Loading user info...</p>}
      {userError && <p className="text-red-500">{userError}</p>}

      {user && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.number && <p><strong>Phone:</strong> {user.number}</p>}
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">User Listings</h2>

      {propertiesLoading && <p>Loading properties...</p>}
      {propertiesError && <p className="text-red-500">{propertiesError}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties?.length > 0 ? (
          properties.map((property) => (
            <div key={property.slug} className="border rounded p-4 shadow">
              <img src={property.image} alt={property.title} className="h-48 w-full object-cover rounded" />
              <h2 className="font-semibold text-lg mt-2">{property.title}</h2>
              <p className="text-sm text-gray-600">{property.city}</p>
              <p className="text-green-600 font-semibold">${property.price}</p>
            </div>
          ))
        ) : (
          !propertiesLoading && <p>No properties found.</p>
        )}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-500 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
