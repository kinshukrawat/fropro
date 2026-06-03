import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const token =
        res.data?.accessToken ||
        res.data?.token ||
        res.data?.access_token;

      if (!token) {
        console.log("Login Response:", res.data);
        alert("Login success but token not found in response.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("adminLogin", "true");
      localStorage.setItem("adminUser", JSON.stringify(res.data?.user || {}));

      navigate("/admin/dashboard");
    } catch (error) {
      console.log("Admin Login Error:", error);
      alert(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Oye Rohini Admin
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Login to manage listings
        </p>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full border p-3 rounded-xl mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-6"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
      </form>
    </div>
  );
}