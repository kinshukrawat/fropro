import logo from "../assets/oye-rohini-logo.png";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: "Categories", path: "/categories" },
    { name: "Popular Categories", path: "/popular-categories" },
    { name: "Reviews", path: "/reviews" },
    { name: "Payments", path: "/payments" },
    { name: "Contact",  path: "/contact" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center">
        <img src={logo} alt="Oye Rohini Logo" className="h-12 w-auto" />
        </Link> 

        <Link to="/" className="text-3xl font-bold text-blue-600">
          Oye Rohini
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2"
          >
            <FaUserCircle />
            Login
          </Link>
        </nav>

        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="flex flex-col p-5 gap-5">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-medium transition ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl text-center font-medium flex items-center justify-center gap-2"
            >
              <FaUserCircle />
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}