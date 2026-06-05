import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaPhoneAlt,
  FaChevronRight,
  FaCut,
  FaDumbbell,
  FaCoffee,
  FaUtensils,
  FaSpa,
  FaUserMd,
  FaShoppingBasket,
  FaBirthdayCake,
  FaPaw,
  FaTooth,
  FaStore,
} from "react-icons/fa";

import SearchSuggestions from "../components/SearchSuggestions";
import Testimonials from "../components/Testimonials";
import API from "../api/api";

const defaultCategories = [
  { name: "Salon", slug: "salon" },
  { name: "Gym", slug: "gym" },
  { name: "Cafe", slug: "cafe" },
  { name: "Restaurant", slug: "restaurant" },
  { name: "Spa", slug: "spa" },
  { name: "Doctor", slug: "doctor" },
  { name: "Grocery", slug: "grocery" },
  { name: "Bakery", slug: "bakery" },
];

const categoryStyles = {
  Salon: {
    icon: <FaCut />,
    color: "bg-pink-100 text-pink-600",
  },
  Gym: {
    icon: <FaDumbbell />,
    color: "bg-blue-100 text-blue-600",
  },
  Cafe: {
    icon: <FaCoffee />,
    color: "bg-yellow-100 text-yellow-600",
  },
  Restaurant: {
    icon: <FaUtensils />,
    color: "bg-red-100 text-red-600",
  },
  Spa: {
    icon: <FaSpa />,
    color: "bg-purple-100 text-purple-600",
  },
  Doctor: {
    icon: <FaUserMd />,
    color: "bg-green-100 text-green-600",
  },
  Grocery: {
    icon: <FaShoppingBasket />,
    color: "bg-emerald-100 text-emerald-600",
  },
  Bakery: {
    icon: <FaBirthdayCake />,
    color: "bg-orange-100 text-orange-600",
  },
  "Pet Shop": {
    icon: <FaPaw />,
    color: "bg-cyan-100 text-cyan-600",
  },
  "Dental Clinic": {
    icon: <FaTooth />,
    color: "bg-indigo-100 text-indigo-600",
  },
};

export default function Home() {
  const [showModal, setShowModal] = useState(true);
  const [categories, setCategories] = useState(defaultCategories);
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    message: "",
  });

  useEffect(() => {
    API.get("/categories")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.log("Categories API Error:", err));

    API.get("/listings")
      .then((res) => {
        const data = res.data?.items || [];
        setListings(data);
      })
      .catch((err) => console.log("Listings API Error:", err));
  }, []);

  const handleSearch = () => {
    const query = new URLSearchParams();

    if (search) query.append("q", search);
    if (location) query.append("city", location.toLowerCase());

    window.location.href = `/listings?${query.toString()}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    try {
    await API.post("/contact", {
  name: formData.name,
  email: "no-email@example.com",
  phone: formData.mobile,
  message: formData.message,
});

      alert("Query submitted successfully!");
      setFormData({
        name: "",
        mobile: "",
        message: "",
      });
    } catch (error) {
      console.log("Query Submit Error:", error);
      alert("Query API backend me available nahi hai.");
    }
  };

  const getCategoryStyle = (name) => {
    return (
      categoryStyles[name] || {
        icon: <FaStore />,
        color: "bg-blue-100 text-blue-600",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-black"
              />
            </div>

            <div className="flex items-center flex-1 border rounded-xl px-4 py-3">
              <FaMapMarkerAlt className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none text-black"
              />
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>

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
            className="flex items-center gap-2 text-blue-600 font-semibold"
          >
            View All <FaChevronRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
          {categories.map((item, index) => {
            const style = getCategoryStyle(item.name);

            return (
              <Link
                to={`/listings?category=${item.slug || item.name}`}
                key={item.id || index}
                className="group bg-white rounded-3xl p-7 text-center shadow-md hover:shadow-2xl transition duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-5 ${style.color}`}
                >
                  {style.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-gray-500 mt-2 text-sm">
                  Explore Best {item.name}
                </p>

                <div className="mt-5 text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition">
                  Explore →
                </div>
              </Link>
            );
          })}
        </div>
      </section>

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
              className="flex items-center gap-2 text-blue-600 font-semibold"
            >
              View All <FaChevronRight />
            </Link>
          </div>

          {listings.length === 0 ? (
            <p className="text-gray-500">No featured listings found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-gray-50 rounded-3xl overflow-hidden shadow hover:shadow-2xl transition group"
                >
                  <span className="absolute top-4 left-4 z-10 bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold shadow">
                    {item.category?.name || item.category || "Business"}
                  </span>

                  <div className="overflow-hidden">
                    <img
                      src={
                        item.images?.[0]?.url ||
                        item.image ||
                        "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={item.name}
                      className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{item.name}</h3>

                      <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        <FaStar className="mr-1" />
                        {item.rating || "4.5"}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 mb-5">
                      <FaMapMarkerAlt className="mr-2" />
                      {item.city?.name ||
                        item.location ||
                        item.addressLine1 ||
                        "Location"}
                    </div>

                    <Link
                     to={`/business/detail/${item.slug}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <FaPhoneAlt />
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Choose Oye Rohini?
          </h2>

          <p className="text-gray-500 text-center mb-12">
            A simple and trusted way to discover nearby businesses
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              [
                "✅",
                "Verified Businesses",
                "We list trusted and quality local businesses near you.",
              ],
              [
                "⚡",
                "Quick Discovery",
                "Find salons, gyms, cafes, restaurants and more in seconds.",
              ],
              [
                "📍",
                "Hyperlocal Search",
                "Explore businesses and services around Rohini easily.",
              ],
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition text-center"
              >
                <div className="text-4xl mb-4">{item[0]}</div>
                <h3 className="text-xl font-bold mb-2">{item[1]}</h3>
                <p className="text-gray-500">{item[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SearchSuggestions />
      <Testimonials />

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
          </div>

          <div className="p-10 md:p-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Send Your Query
            </h3>

            <p className="text-gray-500 mb-10">
              Fill out the form and we’ll contact you shortly.
            </p>

            <form onSubmit={handleQuerySubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none"
                required
              />

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none"
                required
              />

              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 outline-none resize-none"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg"
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