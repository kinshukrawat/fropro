import {
  FaUsers,
  FaBullseye,
  FaHandshake,
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function About() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Oye Rohini
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Oye Rohini helps people discover trusted local businesses like
            salons, gyms, cafes, restaurants, hotels, and more near their
            location.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Your Local Business Partner
            </h2>

            <p className="text-gray-600 mb-5 leading-8">
              Oye Rohini is a hyperlocal platform designed to connect users
              with the best nearby services and businesses.
            </p>

            <p className="text-gray-600 leading-8">
              Whether you're searching for a salon, doctor, gym, or restaurant,
              we provide trusted listings with ratings and contact details.
            </p>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <FaUsers className="text-5xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold">10K+</h3>
                <p className="text-gray-500 mt-2">Active Users</p>
              </div>

              <div className="text-center">
                <FaMapMarkedAlt className="text-5xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold">500+</h3>
                <p className="text-gray-500 mt-2">Local Listings</p>
              </div>

              <div className="text-center">
                <FaHandshake className="text-5xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold">200+</h3>
                <p className="text-gray-500 mt-2">Partners</p>
              </div>

              <div className="text-center">
                <FaBullseye className="text-5xl text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold">100%</h3>
                <p className="text-gray-500 mt-2">Customer Focus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Us
            </h2>

            <p className="text-gray-500">
              We provide the best local discovery experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
              <h3 className="text-2xl font-bold mb-4">
                Trusted Listings
              </h3>

              <p className="text-gray-600 leading-7">
                Verified businesses with ratings and reviews.
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
              <h3 className="text-2xl font-bold mb-4">
                Fast Search
              </h3>

              <p className="text-gray-600 leading-7">
                Easily search nearby businesses in seconds.
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
              <h3 className="text-2xl font-bold mb-4">
                Local Focus
              </h3>

              <p className="text-gray-600 leading-7">
                Discover the best services around your area.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}