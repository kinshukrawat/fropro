import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import API from "../api/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Invalid or missing reset token.");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      return alert("Password must be at least 8 characters long.");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/password-reset/confirm", {
        token,
        newPassword,
      });

      alert(res.data.message || "Password reset successful.");

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Reset link is invalid or has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        <h2 className="text-3xl font-bold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="flex items-center border rounded-xl px-4 py-4">
            <FaLock className="text-gray-400 mr-3" />

            <input
              type="password"
              placeholder="New Password"
              className="w-full outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-xl px-4 py-4">
            <FaLock className="text-gray-400 mr-3" />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-6 text-blue-600 hover:underline"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}