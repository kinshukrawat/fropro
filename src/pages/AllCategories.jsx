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
  FaLaptopCode,
  FaPaintBrush,
} from "react-icons/fa";

const categories = [
  {
    id: 1,
    name: "Salon",
    icon: <FaCut />,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: 2,
    name: "Gym",
    icon: <FaDumbbell />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 3,
    name: "Cafe",
    icon: <FaCoffee />,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 4,
    name: "Restaurant",
    icon: <FaUtensils />,
    color: "bg-red-100 text-red-600",
  },
  {
    id: 5,
    name: "Hotel",
    icon: <FaHotel />,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: 6,
    name: "Spa",
    icon: <FaSpa />,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 7,
    name: "Doctor",
    icon: <FaUserMd />,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    id: 8,
    name: "Repair",
    icon: <FaTools />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: 9,
    name: "Car Services",
    icon: <FaCar />,
    color: "bg-gray-200 text-gray-700",
  },
  {
    id: 10,
    name: "Shopping",
    icon: <FaShoppingBag />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 11,
    name: "IT Services",
    icon: <FaLaptopCode />,
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: 12,
    name: "Beauty",
    icon: <FaPaintBrush />,
    color: "bg-rose-100 text-rose-600",
  },
];

export default function AllCategories() {
  return (
    <div className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4">
            All Categories
          </h1>

          <p className="text-gray-500 text-lg">
            Explore all available business categories
          </p>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl p-8 shadow hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer"
            >
              {/* ICON */}
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 ${category.color}`}
              >
                {category.icon}
              </div>

              {/* TITLE */}
              <h2 className="text-2xl font-bold mb-3">
                {category.name}
              </h2>

              <p className="text-gray-500">
                Explore businesses near you
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}