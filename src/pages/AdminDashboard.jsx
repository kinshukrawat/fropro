import { useEffect, useState } from "react";
import {
  FaUsers,
  FaStore,
  FaClipboardList,
  FaStar,
} from "react-icons/fa";
import API from "../api/api";

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/listings");

      const data = res.data?.items || res.data?.data || res.data || [];
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Listings Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.post(`/admin/listings/${id}/approve`);
      alert("Listing approved successfully");
      fetchListings();
    } catch (error) {
      console.error("Approve Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Approve failed");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");

    if (!reason || reason.trim() === "") {
      alert("Rejection reason is required");
      return;
    }

    try {
      await API.post(`/admin/listings/${id}/reject`, {
        reason: reason.trim(),
      });

      alert("Listing rejected successfully");
      fetchListings();
    } catch (error) {
      console.error("Reject Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Reject failed");
    }
  };

  const handleSuspend = async (id) => {
    try {
      await API.post(`/admin/listings/${id}/suspend`);
      alert("Listing suspended successfully");
      fetchListings();
    } catch (error) {
      console.error("Suspend Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Suspend failed");
    }
  };

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
      <div className="flex-1 p-6 overflow-x-auto">
        <h2 className="text-4xl font-bold mb-8">Admin Dashboard</h2>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <FaUsers className="text-4xl text-blue-600 mb-4" />
            <h3 className="text-3xl font-bold">12K</h3>
            <p className="text-gray-500">Users</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaStore className="text-4xl text-green-600 mb-4" />
            <h3 className="text-3xl font-bold">{listings.length}</h3>
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

        {/* LISTINGS TABLE */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-2xl font-bold mb-5">Business Listings</h3>

          {loading ? (
            <p>Loading listings...</p>
          ) : listings.length === 0 ? (
            <p className="text-gray-500">No listings found.</p>
          ) : (
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Business Name</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">City</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Featured</th>
                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b">
                    <td className="p-3 border font-medium">
                      {listing.name || listing.businessName || "N/A"}
                    </td>

                    <td className="p-3 border">
                      {listing.category?.name || listing.categoryName || "N/A"}
                    </td>

                    <td className="p-3 border">
                      {listing.city?.name || listing.cityName || "N/A"}
                    </td>

                    <td className="p-3 border">
                      <span className="px-3 py-1 rounded-full text-sm bg-gray-200">
                        {listing.status || "N/A"}
                      </span>
                    </td>

                    <td className="p-3 border">
                      {listing.featured ? "Yes" : "No"}
                    </td>

                    <td className="p-3 border">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleApprove(listing.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
                          title="Approve"
                        >
                          ✓
                        </button>

                        <button
                          onClick={() => handleReject(listing.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                          title="Reject"
                        >
                          ✕
                        </button>

                        <button
                          onClick={() => handleSuspend(listing.id)}
                          className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg"
                          title="Suspend"
                        >
                          ⊘
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}