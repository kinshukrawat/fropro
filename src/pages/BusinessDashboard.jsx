import {
  FaStore,
  FaClipboardList,
  FaStar,
  FaChartLine,
} from "react-icons/fa";

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-black text-white p-6 hidden lg:block">
        <h1 className="text-3xl font-bold text-blue-500 mb-10">
          Business Panel
        </h1>

        <div className="space-y-4">
          <button className="w-full bg-blue-600 py-3 rounded-xl">
            Dashboard
          </button>

          <button className="w-full hover:bg-gray-800 py-3 rounded-xl transition">
            My Business
          </button>

          <button className="w-full hover:bg-gray-800 py-3 rounded-xl transition">
            Bookings
          </button>

          <button className="w-full hover:bg-gray-800 py-3 rounded-xl transition">
            Reviews
          </button>

          <button className="w-full hover:bg-gray-800 py-3 rounded-xl transition">
            Analytics
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-6">
        <h2 className="text-4xl font-bold mb-8">
          Business Dashboard
        </h2>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <FaStore className="text-4xl text-blue-600 mb-4" />
            <h3 className="text-3xl font-bold">3</h3>
            <p className="text-gray-500">Businesses</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaClipboardList className="text-4xl text-green-600 mb-4" />
            <h3 className="text-3xl font-bold">84</h3>
            <p className="text-gray-500">Bookings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaStar className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-3xl font-bold">4.8</h3>
            <p className="text-gray-500">Ratings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaChartLine className="text-4xl text-red-500 mb-4" />
            <h3 className="text-3xl font-bold">1200</h3>
            <p className="text-gray-500">Visitors</p>
          </div>
        </div>
      </div>
    </div>
  );
}