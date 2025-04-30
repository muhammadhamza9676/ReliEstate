import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaPlusCircle,
  FaEnvelope,
  FaUserEdit,
  FaHome,
  FaBuilding,
} from 'react-icons/fa';
import { fetchProperties } from '../redux/slices/propertySlice';


const Dashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const allProperties = useSelector((state) => state.property.properties || []);
  const loading = useSelector((state) => state.property.loading);

  const properties = allProperties;

  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProperties({ userId: user.id }));
    }
  }, [dispatch, user?.id]);
  
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Welcome {user ? user.name : 'Guest'}!
        </h1>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Browse Listings */}
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <FaSearch className="text-blue-600 text-3xl" />
              <h2 className="text-2xl font-semibold">Browse Listings</h2>
            </div>
            <p className="text-gray-600 mb-6">Find the property you love.</p>
            <Link
              to="/browse"
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              See Listings →
            </Link>
          </div>

          {/* Card 2: Add Property */}
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <FaPlusCircle className="text-green-600 text-3xl" />
              <h2 className="text-2xl font-semibold">Add Property</h2>
            </div>
            <p className="text-gray-600 mb-6">Post your property for others.</p>
            <Link
              to="/add-property"
              className="text-green-500 hover:text-green-700 font-medium"
            >
              Add Now →
            </Link>
          </div>

          {/* Card 3: My Inquiries */}
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <FaEnvelope className="text-purple-600 text-3xl" />
              <h2 className="text-2xl font-semibold">My Inquiries</h2>
            </div>
            <p className="text-gray-600 mb-6">Manage your inquiries easily.</p>
            <Link
              to="/inquiries"
              className="text-purple-500 hover:text-purple-700 font-medium"
            >
              View Inquiries →
            </Link>
          </div>
        </div>

        {/* My Properties Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaBuilding className="text-indigo-600" /> My Properties
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading properties...</p>
          ) : properties.length === 0 ?
          
           (
            <p className="text-gray-600">
              No properties added yet.{' '}
              <Link
                to="/add-property"
                className="text-green-500 hover:text-green-700"
              >
                Add one now!
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {property.description}
                  </p>
                  <p className="text-indigo-600 font-medium mb-4">
                    ${property.price.toLocaleString()}
                  </p>
                  <div className="flex gap-4">
                    <Link
                      to={`/property/${property.id}`}
                      className="text-indigo-500 hover:text-indigo-700 font-medium"
                    >
                      View
                    </Link>
                    <Link
                      to={`/properties/${property.id}`}
                      className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
      
    </>
    
  );
};

export default Dashboard;
