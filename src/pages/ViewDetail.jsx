import React from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";

export default function ViewDetail() {
  const business = {
    name: "Urban Salon",
    category: "Salon",
    rating: 4.8,
    reviews: 124,
    address: "Sector 7, Rohini, Delhi",
    phone: "+91 9876543210",
    email: "info@example.com",
    timing: "10:00 AM - 9:00 PM",
    website: "https://example.com",
    instagram:
      "https://www.instagram.com/oyerohini_?igsh=MXFlbzRvbndndmJ5Zw%3D%3D&utm_source=qr",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200",
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image */}
      <div className="w-full h-[300px] md:h-[420px]">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm mb-4">
            {business.category}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {business.name}
          </h1>

          <div className="flex items-center gap-2 mt-3 text-yellow-500">
            <FaStar />
            <span className="font-semibold">{business.rating}</span>
            <span className="text-gray-500">
              ({business.reviews} Reviews)
            </span>
          </div>

          <p className="text-gray-600 mt-6 leading-7">
            Urban Salon is a trusted local business offering professional
            services with experienced staff, clean ambience, and customer-first
            support. Visit us for quality service near your area.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Gallery</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <img
                key={item}
                src={business.image}
                alt="Gallery"
                className="h-40 w-full object-cover rounded-xl"
              />
            ))}
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-5">Business Info</h2>

          <div className="space-y-4 text-gray-700">
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600" />
              {business.address}
            </p>

            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-green-600" />
              {business.phone}
            </p>

            <p className="flex items-center gap-3">
              <FaEnvelope className="text-red-500" />
              {business.email}
            </p>

            <p className="flex items-center gap-3">
              <FaClock className="text-orange-500" />
              {business.timing}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <a
              href={`tel:${business.phone}`}
              className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Call Now
            </a>

            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border py-3 rounded-xl font-semibold hover:bg-pink-50 transition"
            >
              <FaInstagram className="text-pink-500 text-xl" />
              Instagram
            </a>

            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              <FaGlobe className="text-blue-600 text-xl" />
              Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}