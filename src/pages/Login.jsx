import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-12">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Oye Rohini
          </h1>

          <p className="text-lg leading-8 text-blue-100">
            Discover trusted local businesses, explore nearby services,
            and connect with the best salons, gyms, cafes,
            restaurants, and more.
          </p>

          <div className="mt-10">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
              alt="auth"
              className="rounded-2xl"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  isLogin
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  !isLogin
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* TITLE */}
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

          {/* FORM */}
          <form className="space-y-5">
            {/* NAME */}
            {!isLogin && (
              <div className="flex items-center border rounded-xl px-4 py-4">
                <FaUser className="text-gray-400 mr-3" />

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full outline-none"
                />
              </div>
            )}

            {/* PHONE */}
            {!isLogin && (
              <div className="flex items-center border rounded-xl px-4 py-4">
                <FaPhoneAlt className="text-gray-400 mr-3" />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full outline-none"
                />
              </div>
            )}

            {/* EMAIL */}
            <div className="flex items-center border rounded-xl px-4 py-4">
              <FaEnvelope className="text-gray-400 mr-3" />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center border rounded-xl px-4 py-4">
              <FaLock className="text-gray-400 mr-3" />

              <input
                type="password"
                placeholder="Password"
                className="w-full outline-none"
              />
            </div>

            {/* FORGOT PASSWORD */}
            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* BUTTON */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {/* FOOTER TEXT */}
          <div className="text-center mt-8 text-gray-500">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
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