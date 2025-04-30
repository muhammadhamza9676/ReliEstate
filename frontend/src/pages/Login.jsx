"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../redux/slices/authSlice"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Home, Lock, Mail } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(login({ email, password })).unwrap()
      toast.success("Login successful!")
      navigate("/dashboard")
    } catch (err) {
      toast.error(err)
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
          <p className="text-xl mb-4">Find your perfect property</p>
          <p className="text-gray-300">Buy, sell, or rent properties with ease</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Home className="w-10 h-10 text-red-600 mr-2" />
            <h1 className="text-3xl font-bold">ReliEstate</h1>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-red-600">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm text-red-600 hover:text-red-800">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="text-red-600 hover:text-red-800 font-medium">
                  Create account
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
