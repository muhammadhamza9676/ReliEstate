"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { verifyOTP } from "../redux/slices/authSlice"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { Home, KeyRound } from "lucide-react"

const VerifyOTP = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState("")
  const { loading, error } = useSelector((state) => state.auth)
  const [email, setEmail] = useState(location.state?.email || "")

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Dispatch the verifyOTP action
    const result = await dispatch(verifyOTP({ email, otp }))

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("OTP verified successfully! You can now log in.")
      navigate("/login") // Redirect to login page after successful OTP verification
    } else {
      toast.error(error || "OTP verification failed. Please try again.")
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
          <p className="text-xl mb-4">Almost there!</p>
          <p className="text-gray-300">Verify your email to complete your registration</p>
        </div>
      </div>

      {/* Right side - OTP Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Home className="w-10 h-10 text-red-600 mr-2" />
            <h1 className="text-3xl font-bold">ReliEstate</h1>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-red-600">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Verify Your Email</h2>
            <p className="text-center text-gray-600 mb-6">
              We've sent a verification code to <span className="font-medium">{email || "your email"}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* OTP Field */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="otp"
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="Enter 6-digit code"
                    className="pl-10 w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center tracking-widest font-medium"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Didn't receive the code?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    // Add resend OTP functionality here
                    toast.info("A new verification code has been sent to your email.")
                  }}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Resend Code
                </a>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/login")
                  }}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Back to Login
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

export default VerifyOTP;