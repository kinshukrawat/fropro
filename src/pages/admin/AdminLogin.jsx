import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();

    if (form.email === "admin@oyerohini.com" && form.password === "admin123") {
      localStorage.setItem("adminLogin", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin email or password");
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
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-6"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800">
          Login
        </button>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Email: admin@oyerohini.com <br />
          Password: admin123
        </p>
      </form>
    </div>
  );
}