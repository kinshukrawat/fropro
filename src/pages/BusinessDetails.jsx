import MapSection from "../components/MapSection";

import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaDirections,
  FaGlobe,
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";

export default function BusinessDetails() {
  const business = {
    name: "Urban Salon",
    category: "Salon",
    rating: 4.8,
    reviews: 245,
    location: "Sector 10, Rohini, Delhi",
    phone: "+91 9876543210",
    website: "www.urbansalon.com",
    timing: "10:00 AM - 9:00 PM",

    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop",

    description:
      "Urban Salon provides premium beauty and grooming services with experienced professionals and modern facilities.",
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO SECTION */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* HERO CONTENT */}
        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 text-white">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* LEFT */}
            <div>
              <p className="bg-blue-600 px-4 py-2 rounded-full w-fit mb-4 font-medium">
                {business.category}
              </p>

              <h1 className="text-5xl font-bold mb-4">
                {business.name}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-lg">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-2" />

                  {business.rating} ({business.reviews} Reviews)
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />

                  {business.location}
                </div>
              </div>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="flex gap-4">
              <button className="bg-white text-black px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition">
                <FaHeart />
                Save
              </button>

              <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition">
                <FaShareAlt />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">
            {/* ABOUT BUSINESS */}
            <div className="bg-white rounded-3xl shadow p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">
                About Business
              </h2>

              <p className="text-gray-600 leading-8 mb-8">
                {business.description}
              </p>

              {/* INFO GRID */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* ADDRESS */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FaMapMarkerAlt className="text-blue-600 mr-3 text-xl" />

                    <h3 className="font-bold text-lg">
                      Address
                    </h3>
                  </div>

                  <p className="text-gray-600">
                    {business.location}
                  </p>
                </div>

                {/* HOURS */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FaClock className="text-blue-600 mr-3 text-xl" />

                    <h3 className="font-bold text-lg">
                      Opening Hours
                    </h3>
                  </div>

                  <p className="text-gray-600">
                    {business.timing}
                  </p>
                </div>

                {/* WEBSITE */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FaGlobe className="text-blue-600 mr-3 text-xl" />

                    <h3 className="font-bold text-lg">
                      Website
                    </h3>
                  </div>

                  <a
                    href={`https://${business.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {business.website}
                  </a>
                </div>

                {/* PHONE */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FaPhoneAlt className="text-blue-600 mr-3 text-xl" />

                    <h3 className="font-bold text-lg">
                      Phone Number
                    </h3>
                  </div>

                  <p className="text-gray-600">
                    {business.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* GALLERY */}
            <div className="bg-white rounded-3xl shadow p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">
                Gallery
              </h2>

              <div className="grid md:grid-cols-3 gap-5">
                <img
                  src={business.image}
                  alt=""
                  className="rounded-2xl h-56 object-cover w-full hover:scale-105 transition duration-300"
                />

                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop"
                  alt=""
                  className="rounded-2xl h-56 object-cover w-full hover:scale-105 transition duration-300"
                />

                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop"
                  alt=""
                  className="rounded-2xl h-56 object-cover w-full hover:scale-105 transition duration-300"
                />
              </div>
            </div>

            {/* MAP SECTION */}
            <MapSection />
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="bg-white rounded-3xl shadow p-8 sticky top-24">
              <h2 className="text-3xl font-bold mb-6">
                Contact Business
              </h2>

              {/* ACTION BUTTONS */}
              <div className="space-y-4 mb-8">
                {/* CALL BUTTON */}
                <a
                  href={`tel:${business.phone}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
                >
                  <FaPhoneAlt />
                  Call Now
                </a>

                {/* DIRECTIONS BUTTON */}
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
                >
                  <FaDirections />
                  Get Directions
                </a>
              </div>

              {/* CONTACT DETAILS */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <p className="font-semibold text-black mb-2">
                    Phone Number
                  </p>

                  <p className="text-gray-600">
                    {business.phone}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="font-semibold text-black mb-2">
                    Address
                  </p>

                  <p className="text-gray-600">
                    {business.location}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <p className="font-semibold text-black mb-2">
                    Working Hours
                  </p>

                  <p className="text-gray-600">
                    {business.timing}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-black mb-2">
                    Website
                  </p>

                  <a
                    href={`https://${business.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {business.website}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}