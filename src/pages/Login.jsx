import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhoneAlt } from "react-icons/fa";
import API from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isLogin) {
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        console.log("LOGIN RESPONSE:", res.data);

        const token = res.data.accessToken || res.data.token;
        const user = res.data.user;

        if (!token) {
          alert("Login failed: token not received");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user || {}));

        alert("Login successful");

        if (user?.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/business-dashboard");
        }
      } else {
        await API.post("/auth/register", {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        });

        alert("Account created successfully. Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.log("Auth Error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-12">
          <h1 className="text-5xl font-bold mb-6">Welcome to Oye Rohini</h1>

          <p className="text-lg leading-8 text-blue-100">
            Discover trusted local businesses, explore nearby services, and
            connect with the best salons, gyms, cafes, restaurants, and more.
          </p>

          <div className="mt-10">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
              alt="auth"
              className="rounded-2xl"
            />
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  isLogin ? "bg-blue-600 text-white" : "text-gray-600"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  !isLogin ? "bg-blue-600 text-white" : "text-gray-600"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-3">
              {isLogin ? "Login" : "Create Account"}
            </h2>

            <p className="text-gray-500">
              {isLogin
                ? "Login to continue exploring businesses."
                : "Create your account and join Oye Rohini."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="flex items-center border rounded-xl px-4 py-4">
                  <FaUser className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full outline-none"
                    required={!isLogin}
                  />
                </div>

                <div className="flex items-center border rounded-xl px-4 py-4">
                  <FaPhoneAlt className="text-gray-400 mr-3" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full outline-none"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div className="flex items-center border rounded-xl px-4 py-4">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>

            <div className="flex items-center border rounded-xl px-4 py-4">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-blue-600 hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-semibold text-lg transition"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-8 text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-semibold ml-2 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}