import { FaFilter, FaStar } from "react-icons/fa";

const categories = [
  "All",
  "Salon",
  "Gym",
  "Cafe",
  "Restaurant",
  "Hotel",
  "Spa",
  "Doctor",
  "Repair",
];

export default function FilterSidebar() {
  return (
    <aside className="bg-white rounded-2xl shadow p-6 w-full lg:w-72">
      <div className="flex items-center gap-3 mb-6">
        <FaFilter className="text-blue-600" />
        <h2 className="text-2xl font-bold">Filters</h2>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Category</h3>

        <div className="space-y-3">
          {categories.map((category, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer text-gray-600">
              <input
                type="radio"
                name="category"
                defaultChecked={category === "All"}
                className="accent-blue-600"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Rating</h3>

        <div className="space-y-3">
          {[5, 4, 3].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer text-gray-600">
              <input type="radio" name="rating" className="accent-blue-600" />

              <span className="flex items-center gap-1 text-yellow-400">
                {[...Array(rating)].map((_, index) => (
                  <FaStar key={index} />
                ))}
              </span>

              <span className="text-gray-500">& above</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Availability</h3>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-600">Open Now</span>
          <input type="checkbox" className="w-5 h-5 accent-blue-600" />
        </label>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Price Range</h3>

        <div className="space-y-3">
          {["Budget", "Mid Range", "Premium"].map((price, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer text-gray-600">
              <input type="radio" name="price" className="accent-blue-600" />
              {price}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
          Apply
        </button>

        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition">
          Reset
        </button>
      </div>
    </aside>
  );
}