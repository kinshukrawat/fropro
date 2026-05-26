import { Link } from "react-router-dom";
import { useState } from "react";

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
  {
    name: "Salon",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=500",
  },
  {
    name: "Gym",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500",
  },
  {
    name: "Cafe",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=500",
  },
  {
    name: "Restaurant",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500",
  },
  {
    name: "Hotel",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=500",
  },
  {
    name: "Spa",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=500",
  },
  {
    name: "Doctor",
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=500",
  },
  {
    name: "Repair",
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=500",
  },
];

const listings = [
  {
    id: 1,
    name: "Urban Salon",
    category: "Salon",
    location: "Delhi",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=500",
  },
  {
    id: 2,
    name: "Fit Gym Club",
    category: "Gym",
    location: "Mumbai",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500",
  },
  {
    id: 3,
    name: "Coffee House",
    category: "Cafe",
    location: "Noida",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=500",
  },
  {
    id: 4,
    name: "Royal Restaurant",
    category: "Restaurant",
    location: "Gurgaon",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500",
  },
];

export default function Home() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= POPUP ================= */}
      {showModal && (
        <Link
          to="/login"
          className="fixed right-4 bottom-6 z-50 bg-blue-600 text-white px-5 py-4 rounded-2xl shadow-2xl hover:bg-blue-700 transition animate-bounce max-w-xs"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowModal(false);
            }}
            className="absolute -top-2 -right-2 bg-white text-black w-6 h-6 rounded-full shadow flex items-center justify-center text-sm"
          >
            ×
          </button>

          <h3 className="font-bold text-lg mb-1">List Your Business 🎉</h3>

          <p className="text-sm text-blue-100">
            Own a business in Rohini? Sign up now and get featured
          </p>
        </Link>
      )}

      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="inline-block bg-white/20 px-5 py-2 rounded-full text-sm font-semibold mb-6">
            Discover Trusted Local Businesses
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Find Best Services <br className="hidden md:block" />
            Near You
          </h1>

          <p className="text-lg md:text-xl mb-10 text-blue-100">
            Salons, Gyms, Cafes, Restaurants, Spas and More
          </p>

          <div className="bg-white rounded-2xl p-3 flex flex-col md:flex-row gap-3 shadow-2xl">
            <div className="flex items-center flex-1 border rounded-xl px-4 py-3">
              <FaSearch className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full outline-none text-black"
              />
            </div>

            <div className="flex items-center flex-1 border rounded-xl px-4 py-3">
              <FaMapMarkerAlt className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Enter location"
                className="w-full outline-none text-black"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition">
              Search
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">
              ⭐ 4.8 Rated Businesses
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full">
              ✅ Verified Listings
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full">
              📍 Rohini Local Services
            </span>
          </div>
        </div>
      </section>

      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold text-black">
              Popular Categories
            </h2>
            <p className="text-gray-500 mt-2">
              Explore top services around your location
            </p>
          </div>

          <Link
            to="/popular-categories"
            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            View All
            <FaChevronRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 cursor-pointer group"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Explore Best {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED LISTINGS ================= */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-black">
                Featured Listings
              </h2>
              <p className="text-gray-500 mt-2">
                Handpicked local businesses for you
              </p>
            </div>

            <Link
              to="/listings"
              className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              View All
              <FaChevronRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {listings.map((item) => (
              <div
                key={item.id}
                className="relative bg-gray-50 rounded-3xl overflow-hidden shadow hover:shadow-2xl transition group"
              >
                <span className="absolute top-4 left-4 z-10 bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold shadow">
                  {item.category}
                </span>

                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">{item.name}</h3>

                    <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                      <FaStar className="mr-1" />
                      {item.rating}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 mb-5">
                    <FaMapMarkerAlt className="mr-2" />
                    {item.location}
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition">
                    <FaPhoneAlt />
                    Contact Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose Oye Rohini?
          </h2>

          <p className="text-gray-500 text-center mb-12">
            A simple and trusted way to discover nearby businesses
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Verified Businesses</h3>
              <p className="text-gray-500">
                We list trusted and quality local businesses near you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Quick Discovery</h3>
              <p className="text-gray-500">
                Find salons, gyms, cafes, restaurants and more in seconds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Hyperlocal Search</h3>
              <p className="text-gray-500">
                Explore businesses and services around Rohini easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SearchSuggestions />

      <Testimonials />

      {/* ================= CTA BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Own a Business in Rohini?
            </h2>

            <p className="text-blue-100">
              List your business today and reach more local customers.
            </p>
          </div>

          <Link
            to="/login"
            className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold shadow hover:bg-blue-50 transition"
          >
            List Your Business
          </Link>
        </div>
      </section>

      {/* ================= SEND YOUR QUERY SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-2">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 md:p-16 flex flex-col justify-center">
            <span className="bg-white/20 w-fit px-5 py-2 rounded-full text-sm font-semibold mb-6">
              Contact Us
            </span>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Let’s Discuss <br />
              Your Requirement
            </h2>

            <p className="text-blue-100 text-lg leading-8 mb-10">
              Looking for salons, gyms, cafes, restaurants or any local business
              service? Send your query and our team will help you quickly.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">📞</div>
                <div>
                  <h4 className="font-semibold text-lg">Quick Support</h4>
                  <p className="text-blue-100 text-sm">
                    Fast response from our support team
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">⭐</div>
                <div>
                  <h4 className="font-semibold text-lg">
                    Trusted Businesses
                  </h4>
                  <p className="text-blue-100 text-sm">
                    Verified and top-rated listings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">📍</div>
                <div>
                  <h4 className="font-semibold text-lg">
                    Hyperlocal Services
                  </h4>
                  <p className="text-blue-100 text-sm">
                    Discover businesses near your area
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Send Your Query
            </h3>

            <p className="text-gray-500 mb-10">
              Fill out the form and we’ll contact you shortly.
            </p>

            <form className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition duration-300"
              >
                Submit Query
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}