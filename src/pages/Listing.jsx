import FilterSidebar from "../components/FilterSidebar";


import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
} from "react-icons/fa";

const listings = [
  {
    id: 1,
    name: "Urban Salon",
    category: "Salon",
    location: "Delhi",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Fit Gym Club",
    category: "Gym",
    location: "Mumbai",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Coffee House",
    category: "Cafe",
    location: "Noida",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Royal Restaurant",
    category: "Restaurant",
    location: "Gurgaon",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Luxury Spa",
    category: "Spa",
    location: "Delhi",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "City Doctor Clinic",
    category: "Doctor",
    location: "Noida",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Listings() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            Explore Listings
          </h1>

          <p className="text-lg text-blue-100 mb-8">
            Find the best local businesses near you
          </p>

          <div className="bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-xl">
            <div className="flex items-center flex-1 border rounded-lg px-4 py-3">
              <FaSearch className="text-gray-400 mr-3" />

              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full outline-none text-black"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* LISTINGS WITH FILTER */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* FILTER SIDEBAR */}
          <FilterSidebar />

          {/* RIGHT SIDE LISTINGS */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">
                Featured Businesses
              </h2>

              <p className="text-gray-500">
                {listings.length} Listings Found
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold">
                        {item.name}
                      </h3>

                      <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                        <FaStar className="mr-1" />
                        {item.rating}
                      </div>
                    </div>

                    <p className="text-blue-600 font-medium mb-3">
                      {item.category}
                    </p>

                    <div className="flex items-center text-gray-500 mb-6">
                      <FaMapMarkerAlt className="mr-2" />
                      {item.location}
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
                        View Details
                      </button>

                      <button className="bg-gray-100 hover:bg-gray-200 p-4 rounded-xl transition">
                        <FaPhoneAlt className="text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}