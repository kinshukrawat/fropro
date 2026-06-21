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

const priceRanges = [
  { label: "Budget", value: "BUDGET" },
  { label: "Mid Range", value: "MID_RANGE" },
  { label: "Premium", value: "PREMIUM" },
];

export default function FilterSidebar({
  selectedCategory = "All",
  selectedPrice = "",
  selectedRating = "",
  openNow = false,
  onCategoryChange = () => {},
  onPriceChange = () => {},
  onRatingChange = () => {},
  onOpenNowChange = () => {},
  onApply = () => {},
  onReset = () => {},
}) {
  return (
    <aside className="bg-white rounded-2xl shadow p-6 w-full lg:w-72">
      <div className="flex items-center gap-3 mb-6">
        <FaFilter className="text-blue-600" />
        <h2 className="text-2xl font-bold">Filters</h2>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Category</h3>

        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer text-gray-600"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => onCategoryChange(category)}
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
          {[5, 4, 3].map((ratingValue) => (
            <label
              key={ratingValue}
              className="flex items-center gap-3 cursor-pointer text-gray-600"
            >
              <input
                type="radio"
                name="rating"
                checked={selectedRating === String(ratingValue)}
                onChange={() => onRatingChange(String(ratingValue))}
                className="accent-blue-600"
              />

              <span className="flex items-center gap-1 text-yellow-400">
                {[...Array(ratingValue)].map((_, index) => (
                  <FaStar key={index} />
                ))}
              </span>

              <span className="text-gray-500"></span>
            </label>
          ))}
        </div>

        {selectedRating && (
          <button
            type="button"
            onClick={() => onRatingChange("")}
            className="text-sm text-blue-600 hover:underline mt-3"
          >
            Clear rating
          </button>
        )}
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Availability</h3>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-600">Open Now</span>
          <input
            type="checkbox"
            checked={openNow}
            onChange={(e) => onOpenNowChange(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
        </label>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Price Range</h3>

        <div className="space-y-3">
          {priceRanges.map((price) => (
            <label
              key={price.value}
              className="flex items-center gap-3 cursor-pointer text-gray-600"
            >
              <input
                type="radio"
                name="price"
                checked={selectedPrice === price.value}
                onChange={() => onPriceChange(price.value)}
                className="accent-blue-600"
              />
              {price.label}
            </label>
          ))}
        </div>

        {selectedPrice && (
          <button
            type="button"
            onClick={() => onPriceChange("")}
            className="text-sm text-blue-600 hover:underline mt-3"
          >
            Clear price range
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onApply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Apply
        </button>

        <button
          onClick={onReset}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
