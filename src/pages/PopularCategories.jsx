import {
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
} from "react-icons/fa";

const categories = [
  { id: 1, name: "Salon", icon: <FaCut />, color: "bg-pink-100 text-pink-600" },
  { id: 2, name: "Gym", icon: <FaDumbbell />, color: "bg-blue-100 text-blue-600" },
  { id: 3, name: "Cafe", icon: <FaCoffee />, color: "bg-yellow-100 text-yellow-600" },
  { id: 4, name: "Restaurant", icon: <FaUtensils />, color: "bg-red-100 text-red-600" },
  { id: 5, name: "Spa", icon: <FaSpa />, color: "bg-purple-100 text-purple-600" },
  { id: 6, name: "Doctor", icon: <FaUserMd />, color: "bg-green-100 text-green-600" },
  { id: 7, name: "Grocery", icon: <FaShoppingBasket />, color: "bg-emerald-100 text-emerald-600" },
  { id: 8, name: "Bakery", icon: <FaBirthdayCake />, color: "bg-orange-100 text-orange-600" },
  { id: 9, name: "Pet Shop", icon: <FaPaw />, color: "bg-cyan-100 text-cyan-600" },
  { id: 10, name: "Dental Clinic", icon: <FaTooth />, color: "bg-indigo-100 text-indigo-600" },
];

function PopularCategories() {
  return (
    <section className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Popular Categories
            </h2>
            <p className="text-gray-600 mt-3">
              Explore trusted services around your location
            </p>
          </div>

          <button className="mt-5 md:mt-0 text-blue-600 font-semibold hover:text-blue-800">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 text-center cursor-pointer hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-5 ${category.color}`}
              >
                {category.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                {category.name}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Explore best {category.name}
              </p>

              <div className="mt-5 text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition">
                Explore →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularCategories;