import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-10">

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10">
        
        {/* Logo Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Oye Rohini
          </h2>

          <p className="text-gray-400">
            Find trusted local businesses near your area.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">
            Quick Links
          </h3>

          <div className="flex flex-col gap-2 text-gray-400">
            <Link
              to="/"
              className="hover:text-white transition duration-300"
            >
              Home
            </Link>

            <Link
              to="/listings"
              className="hover:text-white transition duration-300"
            >
              Listings
            </Link>

            <Link
              to="/categories"
              className="hover:text-white transition duration-300"
            >
              Categories
            </Link>

            <Link
              to="/about"
              className="hover:text-white transition duration-300"
            >
              About
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-4">
            Categories
          </h3>

          <div className="flex flex-col gap-2 text-gray-400">
            <Link
              to="/categories"
              className="hover:text-white transition duration-300"
            >
              Salon
            </Link>

            <Link
              to="/categories"
              className="hover:text-white transition duration-300"
            >
              Gym
            </Link>

            <Link
              to="/categories"
              className="hover:text-white transition duration-300"
            >
              Cafe
            </Link>

            <Link
              to="/categories"
              className="hover:text-white transition duration-300"
            >
              Restaurant
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4">
            Contact
          </h3>

          <div className="text-gray-400 space-y-2">
            <p>Email: Keyproductionofficial@gmail.com</p>
            <p>Phone: +91 8448866017</p>
          </div>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/oyerohini_?igsh=MXFlbzRvbndndmJ5Zw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-5 group"
          >

            <FaInstagram className="text-3xl text-pink-500 group-hover:scale-110 transition duration-300" />


            <span className="font-medium text-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent group-hover:brightness-125 transition duration-300">
              oye rohini
            </span>
          </a>

        </div>

      </div>

      {/* Bottom Footer */}
      <div className="text-center text-gray-500 mt-10 border-t border-gray-800 pt-6">
        © 2026 Oye Rohini. All Rights Reserved.
      </div>

    </footer>
  );
}