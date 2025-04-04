import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slices/authSlice"; // The register action from authSlice
import { useNavigate } from "react-router-dom"; // For navigation
import { toast } from "react-toastify"; // For displaying toasts

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.auth); // To track loading/error states

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Dispatch the register action
    const result = await dispatch(register({ name, email, password }));
  
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Registration successful! Please check your email for OTP.");
      navigate("/verify-otp", { state: { email } }); // Pass the email to OTP verification page
    } else {
      toast.error(error || "Registration failed. Please try again.");
    }
  };
  

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded mt-4"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p>
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
