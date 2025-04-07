import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPropertyBySlug } from "../redux/slices/propertySlice";
import { Link } from "react-router-dom";
import InquiryForm from "../components/InquiryForm";

const PropertyDetails = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { property, loading, error } = useSelector((state) => state.property);
    const user = useSelector((state) => state.auth);
    const token = user?.accessToken;

    useEffect(() => {
        if (slug) {
            dispatch(fetchPropertyBySlug(slug));
        }
    }, [slug, dispatch]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;
    if (!property) return <p className="p-4">No property found.</p>;

    const {
        title,
        description,
        price,
        type,
        purpose,
        area,
        bedrooms,
        bathrooms,
        location,
        images,
        postedBy,
        facilities,
        features,
        furnishing,
        tags,
        availabilityDate,
    } = property;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600 mb-4">{location?.city}, {location?.state}, {location?.country}</p>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {images?.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        alt={`Property ${i}`}
                        className="w-full h-64 object-cover rounded"
                    />
                ))}
            </div>

            {/* Main info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <p><strong>Type:</strong> {type}</p>
                <p><strong>Purpose:</strong> {purpose}</p>
                <p><strong>Price:</strong> ${price}</p>
                <p><strong>Area:</strong> {area?.value} {area?.unit}</p>
                {bedrooms !== undefined && <p><strong>Bedrooms:</strong> {bedrooms}</p>}
                {bathrooms !== undefined && <p><strong>Bathrooms:</strong> {bathrooms}</p>}
                {furnishing && <p><strong>Furnishing:</strong> {furnishing}</p>}
                {availabilityDate && <p><strong>Available from:</strong> {new Date(availabilityDate).toDateString()}</p>}
            </div>

            {/* Features & Facilities */}
            {features && Object.keys(features).length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold">Features:</h3>
                    <ul className="list-disc ml-6">
                        {Object.entries(features).map(([key, val]) => (
                            <li key={key}>{key}: {val}</li>
                        ))}
                    </ul>
                </div>
            )}

            {facilities && Object.keys(facilities).length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold">Facilities:</h3>
                    <ul className="list-disc ml-6">
                        {Object.entries(facilities).map(([key, val]) => val && <li key={key}>{key}</li>)}
                    </ul>
                </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <span key={i} className="bg-gray-200 text-sm px-2 py-1 rounded">{tag}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Description */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Description:</h3>
                <p>{description}</p>
            </div>

            {/* Contact Info */}
            {postedBy && (
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Posted by</h3>
                    <p><strong>Name:</strong> {postedBy.name}</p>
                    <p><strong>Email:</strong> {postedBy.email}</p>
                    <p><strong>Phone:</strong> {postedBy.phone}</p>
                    <p className="mt-4 text-sm">
                        <Link
                            to={`/users/${property.postedBy._id}`}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {property.postedBy.name}
                        </Link>
                    </p>
                </div>
            )}
    {
        property && (
            <InquiryForm propertyId={property._id} token={token} />
        )
    }
            

        </div>
    );
};

export default PropertyDetails;
