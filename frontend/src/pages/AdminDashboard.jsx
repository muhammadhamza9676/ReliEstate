"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts"
import {
  Users,
  Home,
  MessageSquare,
  UserCheck,
  AlertCircle,
  Loader,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
  PieChartIcon,
  User,
  Mail,
  MapPin,
  DollarSign,
  ChevronRight,
} from "lucide-react"
import LogoutButton from "../components/LogoutButton"
import Navbar from "../components/Navbar"

// Custom theme colors
const THEME_COLORS = ["#e11d48", "#1e293b", "#0284c7", "#059669"]

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth)
  const token = user?.accessToken

  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(res.data)
        setDashboard(res.data.data)
        setError(null)
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user?.user?.role === "admin") {
      fetchDashboard()
    }
  }, [user, token])

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader className="h-12 w-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )

  if (!dashboard)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No dashboard data available.</p>
      </div>
    )

  const { overview, users, properties, inquiries } = dashboard

  const roleData = [
    { name: "Admins", value: overview.userRoles.admin || 0 },
    { name: "Brokers", value: overview.userRoles.broker || 0 },
    { name: "Users", value: overview.userRoles.user || 0 },
  ]

  const propertyStatusData = [
    { name: "For Sale", count: overview.totalSaleProperties || 0 },
    { name: "For Rent", count: overview.totalRentProperties || 0 },
    { name: "Total", count: overview.totalProperties || 0 },
  ]

  // Calculate percentage changes (mock data for example)
  const getUsersChange = () => {
    return { value: 12.5, increase: true }
  }

  const getPropertiesChange = () => {
    return { value: 8.3, increase: true }
  }

  const getInquiriesChange = () => {
    return { value: 5.2, increase: false }
  }

  const getBrokersChange = () => {
    return { value: 15.7, increase: true }
  }

  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-gray-300">Welcome back, {user?.user?.name || "Admin"}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-gray-300 mr-2">
                <Clock className="h-4 w-4 inline mr-1" />
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Users"
            value={overview.totalUsers}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            change={getUsersChange()}
            color="blue"
          />
          <StatCard
            label="Total Properties"
            value={overview.totalProperties}
            icon={<Home className="h-6 w-6 text-red-600" />}
            change={getPropertiesChange()}
            color="red"
          />
          <StatCard
            label="Total Inquiries"
            value={overview.totalInquiries}
            icon={<MessageSquare className="h-6 w-6 text-amber-600" />}
            change={getInquiriesChange()}
            color="amber"
          />
          <StatCard
            label="Verified Brokers"
            value={overview?.totalVerifiedBrokers ?? 0}
            icon={<UserCheck className="h-6 w-6 text-green-600" />}
            //change={getBrokersChange()}
            color="green"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-md mr-3">
                  <PieChartIcon className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-lg font-bold">User Distribution</h2>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} `, "Value Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-md mr-3">
                  <BarChart3 className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-lg font-bold">Property Status</h2>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} Properties`, "Count"]} />
                <Legend />
                <Bar dataKey="count" name="Properties" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-md mr-3">
                    <User className="h-5 w-5 text-red-600" />
                  </div>
                  <h2 className="text-lg font-bold">Recent Users</h2>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.recentUsers.map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "broker"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-red-600 hover:text-red-900 mr-3">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-md mr-3">
                    <Home className="h-5 w-5 text-red-600" />
                  </div>
                  <h2 className="text-lg font-bold">Recent Properties</h2>
                </div>
                <button className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.recentProperties.map((property, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{property?.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">{property?.location?.city}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          <div className="text-sm text-gray-900 font-medium">{property?.price}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            property.status === "active"
                              ? "bg-green-100 text-green-800"
                              : property.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {property?.status || "active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-red-600 hover:text-red-900 mr-3">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default AdminDashboard

// Enhanced StatCard Component
const StatCard = ({ label, value, icon, change, color }) => {
  const getColorClass = (color) => {
    switch (color) {
      case "red":
        return "bg-red-50"
      case "blue":
        return "bg-blue-50"
      case "green":
        return "bg-green-50"
      case "amber":
        return "bg-amber-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-md ${getColorClass(color)}`}>{icon}</div>
        {change && (
          <div
            className={`flex items-center text-sm ${change.increase ? "text-green-600" : "text-red-600"} font-medium`}
          >
            {change.increase ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
            {change.value}%
          </div>
        )}
      </div>
      <h3 className="text-sm text-gray-500 mb-1">{label}</h3>
      <p className="text-2xl font-bold">{value.toLocaleString()}</p>
    </div>
  )
}
