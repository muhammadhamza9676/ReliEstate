import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../redux/slices/authSlice"; // The verifyOTP action from authSlice
import { useNavigate, useLocation } from "react-router-dom"; // For navigation
import { toast } from "react-toastify"; // For displaying toasts

const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const { loading, error } = useSelector((state) => state.auth); // To track loading/error states
  const [email, setEmail] = useState(location.state?.email || ""); // Using location state to pass email

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch the verifyOTP action
    const result = await dispatch(verifyOTP({ email, otp }));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("OTP verified successfully! You can now log in.");
      navigate("/login"); // Redirect to login page after successful OTP verification
    } else {
      toast.error(error || "OTP verification failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Field */}
        <div>
          <label htmlFor="otp" className="block text-sm font-medium">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
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
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p>
          Didn't receive the OTP?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
