import {
  FaUsers,
  FaStore,
  FaClipboardList,
  FaStar,
} from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-gray-900 text-white p-6 hidden lg:block">
        <h1 className="text-3xl font-bold text-blue-500 mb-10">
          Admin Panel
        </h1>

        <div className="space-y-4">
          <button className="w-full bg-blue-600 py-3 rounded-xl">
            Dashboard
          </button>

          <button className="w-full hover:bg-gray-800 py-3 rounded-xl transition">
            Users
          </button>

          <button className="w-full hover:bg-gray-800 py-3 rounded-xl transition">
            Listings
          </button>

          <button className="w-full hover:bg-gray-800 py-3 rounded-xl transition">
            Reviews
          </button>

          <button className="w-full hover:bg-gray-800 py-3 rounded-xl transition">
            Settings
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-6">
        <h2 className="text-4xl font-bold mb-8">
          Admin Dashboard
        </h2>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <FaUsers className="text-4xl text-blue-600 mb-4" />
            <h3 className="text-3xl font-bold">12K</h3>
            <p className="text-gray-500">Users</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaStore className="text-4xl text-green-600 mb-4" />
            <h3 className="text-3xl font-bold">2400</h3>
            <p className="text-gray-500">Listings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaClipboardList className="text-4xl text-red-500 mb-4" />
            <h3 className="text-3xl font-bold">1100</h3>
            <p className="text-gray-500">Bookings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaStar className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-3xl font-bold">4800</h3>
            <p className="text-gray-500">Reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}