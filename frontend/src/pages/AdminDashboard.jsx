import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth);
  const token = user.accessToken;
  console.log(token);

  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboard(res.data.data);
      } catch (err) {
        setError("Failed to load dashboard");
      }
    };

    if (user?.user?.role === "admin") {
      fetchDashboard();
    }
  }, [user]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!dashboard) return <p>Loading admin dashboard...</p>;

  const { overview, users, properties, inquiries } = dashboard;

  const roleData = [
    { name: "Admins", value: overview.totalAdmins },
    { name: "Brokers", value: overview.totalBrokers },
    { name: "Buyers", value: overview.totalBuyers },
  ];

  const propertyStatusData = [
    { name: "Active", count: overview.totalActiveProperties },
    { name: "Pending", count: overview.totalPendingProperties },
    { name: "Sold", count: overview.totalSoldProperties },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Users" value={overview.totalUsers} />
        <StatCard label="Total Properties" value={overview.totalProperties} />
        <StatCard label="Total Inquiries" value={overview.totalInquiries} />
        <StatCard label="Verified Brokers" value={overview.totalVerifiedBrokers} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">User Roles</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" outerRadius={80} label>
                {roleData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Property Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={propertyStatusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentTable title="Recent Users" items={users.recentUsers} columns={["name", "email"]} />
        <RecentTable title="Recent Properties" items={properties.recentProperties} columns={["title", "city"]} />
      </div>
    </div>
  );
};

export default AdminDashboard;

// 🧩 StatCard Component
const StatCard = ({ label, value }) => (
  <div className="bg-white p-4 shadow rounded text-center">
    <h3 className="text-sm text-gray-500">{label}</h3>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

// 🧩 Reusable Table
const RecentTable = ({ title, items, columns }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <table className="w-full text-sm">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="text-left py-1 capitalize">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i} className="border-t">
            {columns.map((col) => (
              <td key={col} className="py-1">{item[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
