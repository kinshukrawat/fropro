import {
  FaHeart,
  FaClipboardList,
  FaStar,
  FaUser,
} from "react-icons/fa";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-blue-600 text-white p-6 hidden lg:block">
        <h1 className="text-3xl font-bold mb-10">
          User Panel
        </h1>

        <div className="space-y-4">
          <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold">
            Dashboard
          </button>

          <button className="w-full hover:bg-blue-500 py-3 rounded-xl transition">
            Favorites
          </button>

          <button className="w-full hover:bg-blue-500 py-3 rounded-xl transition">
            My Bookings
          </button>

          <button className="w-full hover:bg-blue-500 py-3 rounded-xl transition">
            Reviews
          </button>

          <button className="w-full hover:bg-blue-500 py-3 rounded-xl transition">
            Profile
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-6">
        <h2 className="text-4xl font-bold mb-8">
          Welcome Back 👋
        </h2>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <FaHeart className="text-4xl text-red-500 mb-4" />
            <h3 className="text-3xl font-bold">24</h3>
            <p className="text-gray-500">Favorites</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaClipboardList className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-3xl font-bold">12</h3>
            <p className="text-gray-500">Bookings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaStar className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-3xl font-bold">8</h3>
            <p className="text-gray-500">Reviews</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaUser className="text-4xl text-green-500 mb-4" />
            <h3 className="text-3xl font-bold">Profile</h3>
            <p className="text-gray-500">Manage Account</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Latest Payments</h3>
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <strong>{payment.listing?.name || "Listing"}</strong>
                    <span>{payment.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Amount: {(payment.amountPaise || 0) / 100} INR
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">My Subscriptions</h3>
            <div className="space-y-3">
              {subscriptions.slice(0, 5).map((subscription) => (
                <div key={subscription.id} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <strong>{subscription.listing?.name || "Listing"}</strong>
                    <span>{subscription.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {subscription.plan?.name || "Plan"} · {subscription.plan?.duration || "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
