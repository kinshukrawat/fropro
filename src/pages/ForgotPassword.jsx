import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import API from "../api/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/password-reset/request", {
        email,
      });

      alert(
        res.data.message ||
          "If the account exists, a reset email has been sent."
      );

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">

        <h2 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Enter your registered email address.
          <br />
          We'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="flex items-center border rounded-xl px-4 py-4">

            <FaEnvelope className="text-gray-400 mr-3" />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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