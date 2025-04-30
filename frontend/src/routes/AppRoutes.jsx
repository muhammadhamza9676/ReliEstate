import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import Signup from "../pages/Signup";
import VerifyOTP from "../components/VerifyOTP";
import AddProperty from "../pages/AddProperty";
import PropertyList from "../pages/PropertyList";
import PropertyDetails from "../pages/PropertyDetails";
import UserProfile from "../pages/UserProfile";
import MyInquiries from "../pages/MyInquiries";
import ProtectedAdminRoute from "./AdminRoutes";
import AdminDashboard from "../pages/AdminDashboard";
import EditProperty from "../pages/EditProperty";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/browse" element={<PropertyList />} />
        <Route path="/properties/:slug" element={<PropertyDetails />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        {/* <ProtectedRoute path="/dashboard" component={Dashboard} /> */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/inquiries" element={<ProtectedRoute><MyInquiries /></ProtectedRoute>} />
        <Route path="/edit-property/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedAdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
