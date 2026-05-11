// src/pages/Categories.jsx

import React from "react";
import {
  FaUtensils,
  FaSpa,
  FaDumbbell,
  FaHotel,
  FaCoffee,
  FaCut,
  FaClinicMedical,
  FaShoppingBag,
  FaCar,
  FaLaptopCode,
  FaArrowRight,
} from "react-icons/fa";

const categories = [
  {
    id: 1,
    name: "Restaurants",
    icon: <FaUtensils />,
    listings: "120+ Listings",
  },
  {
    id: 2,
    name: "Salon & Spa",
    icon: <FaSpa />,
    listings: "85+ Listings",
  },
  {
    id: 3,
    name: "Gym & Fitness",
    icon: <FaDumbbell />,
    listings: "60+ Listings",
  },
  {
    id: 4,
    name: "Hotels",
    icon: <FaHotel />,
    listings: "40+ Listings",
  },
  {
    id: 5,
    name: "Cafes",
    icon: <FaCoffee />,
    listings: "95+ Listings",
  },
  {
    id: 6,
    name: "Beauty Parlour",
    icon: <FaCut />,
    listings: "70+ Listings",
  },
  {
    id: 7,
    name: "Clinics",
    icon: <FaClinicMedical />,
    listings: "55+ Listings",
  },
  {
    id: 8,
    name: "Shopping",
    icon: <FaShoppingBag />,
    listings: "150+ Listings",
  },
  {
    id: 9,
    name: "Car Services",
    icon: <FaCar />,
    listings: "45+ Listings",
  },
  {
    id: 10,
    name: "IT Services",
    icon: <FaLaptopCode />,
    listings: "30+ Listings",
  },
];

export default function Categories() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">

      {/* Heading */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore Categories
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover the best local businesses across different categories
          in your city.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 group cursor-pointer"
          >

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition">
              {category.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2">
              {category.name}
            </h2>

            {/* Listings */}
            <p className="text-gray-500 mb-4">
              {category.listings}
            </p>

            {/* Button */}
            <button className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition">
              Explore
              <FaArrowRight />
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}