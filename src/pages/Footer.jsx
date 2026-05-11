import React from 'react'

export default function Footer() {
  return (
    <div>{/* ================= FOOTER ================= */}
<footer className="bg-black text-white py-12 mt-10">

        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-2xl font-bold mb-4">
              Oye Rohini
            </h2>

            <p className="text-gray-400">
              Find trusted local businesses near your area.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2 text-gray-400">
              <a href="#">Home</a>
              <a href="#">Listings</a>
              <a href="#">Categories</a>
              <a href="#">About</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Categories
            </h3>

            <div className="flex flex-col gap-2 text-gray-400">
              <a href="#">Salon</a>
              <a href="#">Gym</a>
              <a href="#">Cafe</a>
              <a href="#">Restaurant</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">
              Contact
            </h3>

            <div className="text-gray-400 space-y-2">
              <p>Email: info@example.com</p>
              <p>Phone: +91 9876543210</p>
            </div>
          </div>

        </div>

        <div className="text-center text-gray-500 mt-10 border-t border-gray-800 pt-6">
          © 2026 Oye Rohini. All Rights Reserved.
        </div>

      </footer></div>
  )
}
