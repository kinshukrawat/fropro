import { FaSearch } from "react-icons/fa";

const suggestions = [
  "Best Gym Near Me",
  "Top Salon in Delhi",
  "Cafe in Rohini",
  "Restaurants Near Metro",
  "Spa in Gurgaon",
  "Best Hotels",
];

export default function SearchSuggestions() {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6">
        Popular Searches
      </h2>

      <div className="flex flex-wrap gap-4">
        {suggestions.map((item, index) => (
          <button
            key={index}
            className="flex items-center gap-2 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition px-5 py-3 rounded-xl font-medium"
          >
            <FaSearch />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}