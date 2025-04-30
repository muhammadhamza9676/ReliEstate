"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { register } from "../redux/slices/authSlice"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Home, Lock, Mail, User } from "lucide-react"

const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { loading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Dispatch the register action
    const result = await dispatch(register({ name, email, password }))

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Registration successful! Please check your email for OTP.")
      navigate("/verify-otp", { state: { email } }) // Pass the email to OTP verification page
    } else {
      toast.error(error || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center relative">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 text-white text-center px-8">
          <div className="flex items-center justify-center mb-6">
            <Home className="w-12 h-12 text-red-600 mr-2" />
            <h1 className="text-4xl font-bold">ReliEstate</h1>
          </div>
          <p className="text-xl mb-4">Join our community today</p>
          <p className="text-gray-300">Create an account to buy, sell, or rent properties</p>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Home className="w-10 h-10 text-red-600 mr-2" />
            <h1 className="text-3xl font-bold">ReliEstate</h1>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-red-600">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-red-600 hover:text-red-800">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-red-600 hover:text-red-800">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/login")
                  }}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© 2025 ReliEstate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup;
