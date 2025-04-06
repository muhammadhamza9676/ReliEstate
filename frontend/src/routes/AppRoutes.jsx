import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import Signup from "../pages/Signup";
import VerifyOTP from "../components/VerifyOTP";
import AddProperty from "../pages/AddProperty";
import PropertyList from "../pages/PropertyList";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/browse" element={<PropertyList/>} />
        {/* <ProtectedRoute path="/dashboard" component={Dashboard} /> */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add-property" element={<ProtectedRoute><AddProperty/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
