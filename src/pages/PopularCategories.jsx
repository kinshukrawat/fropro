import {
  FaCut,
  FaDumbbell,
  FaCoffee,
  FaUtensils,
  FaHotel,
  FaSpa,
  FaUserMd,
  FaTools,
  FaCar,
  FaShoppingBag,
} from "react-icons/fa";

const categories = [
  {
    id: 1,
    name: "Salon",
    icon: <FaCut />,
    businesses: "120+ Businesses",
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: 2,
    name: "Gym",
    icon: <FaDumbbell />,
    businesses: "95+ Businesses",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    name: "Cafe",
    icon: <FaCoffee />,
    businesses: "80+ Businesses",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 4,
    name: "Restaurant",
    icon: <FaUtensils />,
    businesses: "150+ Businesses",
    color: "bg-red-100 text-red-600",
  },
  {
    id: 5,
    name: "Hotel",
    icon: <FaHotel />,
    businesses: "60+ Businesses",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: 6,
    name: "Spa",
    icon: <FaSpa />,
    businesses: "45+ Businesses",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 7,
    name: "Clinic",
    icon: <FaUserMd />,
    businesses: "70+ Businesses",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 8,
    name: "Repair",
    icon: <FaTools />,
    businesses: "55+ Businesses",
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 9,
    name: "Car Service",
    icon: <FaCar />,
    businesses: "40+ Businesses",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    id: 10,
    name: "Shopping",
    icon: <FaShoppingBag />,
    businesses: "110+ Businesses",
    color: "bg-emerald-100 text-emerald-600",
  },
];

function PopularCategories() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Popular Categories
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Explore top business categories around your city
        </p>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 text-center cursor-pointer hover:-translate-y-2"
          >
            {/* Icon */}
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${category.color}`}
            >
              {category.icon}
            </div>

            {/* Name */}
            <h2 className="text-xl font-semibold text-gray-800">
              {category.name}
            </h2>

            {/* Businesses */}
            <p className="text-gray-500 mt-2">
              {category.businesses}
            </p>

            {/* Button */}
            <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition">
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularCategories;