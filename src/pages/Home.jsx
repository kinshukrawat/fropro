import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaPhoneAlt,
  FaChevronRight,
} from "react-icons/fa";

import SearchSuggestions from "../components/SearchSuggestions";
import Testimonials from "../components/Testimonials";

const categories = [
  "Salon",
  "Gym",
  "Cafe",
  "Restaurant",
  "Hotel",
  "Spa",
  "Doctor",
  "Repair",
];

const listings = [
  {
    id: 1,
    name: "Urban Salon",
    category: "Salon",
    location: "Delhi",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Fit Gym Club",
    category: "Gym",
    location: "Mumbai",
    rating: 4.6,
  },
  {
    id: 3,
    name: "Coffee House",
    category: "Cafe",
    location: "Noida",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Royal Restaurant",
    category: "Restaurant",
    location: "Gurgaon",
    rating: 4.9,
  },
];

export default function Home() {

  // ================= MODAL STATE =================
  const [showModal, setShowModal] = useState(false);

  // ================= AUTO OPEN MODAL =================
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Find Best Services Near You
          </h1>

          <p className="text-lg md:text-xl mb-10">
            Salons, Gyms, Cafes, Restaurants and More
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-xl">

            <div className="flex items-center flex-1 border rounded-lg px-4 py-3">
              <FaSearch className="text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="Search services..."
                className="w-full outline-none text-black"
              />
            </div>

            <div className="flex items-center flex-1 border rounded-lg px-4 py-3">
              <FaMapMarkerAlt className="text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="Enter location"
                className="w-full outline-none text-black"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
              Search
            </button>

          </div>
        </div>
      </section>

      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            Popular Categories
          </h2>

          <Link
            to="/popular-categories"
            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            View All
            <FaChevronRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">

          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer text-center"
            >
              <div className="text-lg font-semibold">
                {item}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ================= FEATURED LISTINGS ================= */}
      <section className="bg-white py-16">

        <div className="max-w-7xl mx-auto px-4">

          {/* Heading */}
          <div className="flex items-center justify-between mb-8">

            <h2 className="text-3xl font-bold text-black">
              Featured Listings
            </h2>

            <Link
              to="/listings"
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              View All
              <FaChevronRight />
            </Link>

          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
              >

                {/* Image */}
                <div className="h-48 bg-gray-300"></div>

                {/* Content */}
                <div className="p-5">

                  <div className="flex items-center justify-between mb-3">

                    <h3 className="text-xl font-bold">
                      {item.name}
                    </h3>

                    <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                      <FaStar className="mr-1" />
                      {item.rating}
                    </div>

                  </div>

                  <p className="text-gray-500 mb-2">
                    {item.category}
                  </p>

                  <div className="flex items-center text-gray-500 mb-5">
                    <FaMapMarkerAlt className="mr-2" />
                    {item.location}
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition">
                    <FaPhoneAlt />
                    Contact Now
                  </button>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= ON LOAD POPUP ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-2xl animate-bounce">

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold mb-3 text-center text-black">
              Welcome to Oye Rohini 🎉
            </h2>

            <p className="text-gray-500 text-center mb-6">
              Discover best salons, gyms, cafes, restaurants & more near you.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Explore Now
            </button>

          </div>
        </div>
      )}

      <SearchSuggestions />

      <Testimonials />

    </div>
  );
}