import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaList,

  FaUsers,
  FaRupeeSign,

  FaCrown,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,

  FaCheck,
  FaTimes,
  FaSearch,
  FaBan,
  FaChartLine,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import API from "../../api/api";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
  { id: "listings", label: "Listings", icon: <FaList /> },

  { id: "users", label: "Users", icon: <FaUsers /> },
  { id: "payments", label: "Payments", icon: <FaRupeeSign /> },
  { id: "sponsored", label: "Sponsored", icon: <FaCrown /> },
  { id: "enquiries", label: "Enquiries", icon: <FaEnvelope /> },
  { id: "settings", label: "Settings", icon: <FaCog /> },
];



export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [statsRes, listingsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/listings"),
      ]);

      setStats(statsRes.data || {});
      setListings(listingsRes.data?.items || listingsRes.data || []);
    } catch (error) {
      console.log("Admin Data Error:", error.response?.data || error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Admin access required. Please login again.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data?.items || res.data || []);
    } catch (error) {
      console.log("Users Error:", error.response?.data || error);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await API.get("/admin/payments");
      setPayments(res.data?.items || res.data || []);
    } catch (error) {
      console.log("Payments Error:", error.response?.data || error);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await API.get("/admin/contact");

      setEnquiries(res.data?.data || []);
    } catch (error) {
      console.log("Enquiries Error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "payments") fetchPayments();
    if (activeTab === "enquiries") fetchEnquiries();
  }, [activeTab]);
  

  const approveListing = async (id) => {
    try {
      await API.post(`/admin/listings/${id}/approve`);
      alert("Listing approved successfully");
      fetchAdminData();
    } catch (error) {
      console.log("Approve Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to approve listing");
    }
  };

  const rejectListing = async (id) => {
    try {
      await API.post(`/admin/listings/${id}/reject`);
      alert("Listing rejected");
      fetchAdminData();
    } catch (error) {
      console.log("Reject Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to reject listing");
    }
  };

  const suspendListing = async (id) => {
    try {
      await API.post(`/admin/listings/${id}/suspend`);
      alert("Listing suspended");
      fetchAdminData();
    } catch (error) {
      console.log("Suspend Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to suspend listing");
    }
  };

  const toggleFeatured = async (id, currentValue) => {
    try {
      await API.patch(`/admin/listings/${id}/featured`, {
        isFeatured: !currentValue,
      });

      fetchAdminData();
    } catch (error) {
      console.log("Featured Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to update featured status");
    }
  };

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const name = item.name || "";
      const category = item.category?.name || item.category || "";
      const city = item.city?.name || item.city || "";
      const status = item.status || "";

      const matchSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        category.toLowerCase().includes(search.toLowerCase()) ||
        city.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "All" || status.toUpperCase() === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [listings, search, filterStatus]);

  const totalListings = stats.totalListings ?? listings.length;
  const approved =
    stats.approvedListings ??
    listings.filter((i) => i.status === "APPROVED").length;
  const pending =
    stats.pendingListings ??
    listings.filter((i) => i.status === "SUBMITTED" || i.status === "PENDING")
      .length;
  const rejected =
    stats.rejectedListings ??
    listings.filter((i) => i.status === "REJECTED").length;
  const sponsored =
    stats.featuredListings ?? listings.filter((i) => i.isFeatured).length;

  const growthData = [
    { month: "Jan", listings: 2, users: 5, payments: 1 },
    { month: "Feb", listings: 5, users: 12, payments: 3 },
    { month: "Mar", listings: 9, users: 18, payments: 5 },
    { month: "Apr", listings: 14, users: 26, payments: 8 },
    { month: "May", listings: 20, users: 35, payments: 12 },
    {
      month: "Jun",
      listings: totalListings || 24,
      users: users.length || 42,
      payments: payments.length || 15,
    },
  ];

  const statusData = [
    { name: "Approved", value: approved },
    { name: "Pending", value: pending },
    { name: "Rejected", value: rejected },
    { name: "Sponsored", value: sponsored },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <aside className="w-72 bg-blue-900 text-white min-h-screen p-6 hidden md:block">
        <h1 className="text-3xl font-extrabold">Oye Rohini Admin</h1>
        <p className="text-blue-200 text-sm mt-1">Control Panel</p>

        <div className="h-1 bg-cyan-400 rounded-full my-6"></div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                activeTab === item.id
                  ? "bg-white text-blue-900 shadow-lg"
                  : "hover:bg-blue-800"
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-900 mt-8"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </aside>


      <main className="flex-1 p-4 md:p-8">
        <div className="bg-white p-5 rounded-2xl shadow mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            <p className="text-gray-500">Manage Oye Rohini platform</p>
          </div>

          <button
            onClick={logout}
            className="md:hidden bg-slate-900 text-white px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>

        {loading && <p className="mb-4 text-blue-700">Loading data...</p>}

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
              <Card title="Total Listings" value={totalListings} />
              <Card title="Approved" value={approved} color="text-green-600" />
              <Card title="Pending" value={pending} color="text-yellow-600" />
              <Card title="Rejected" value={rejected} color="text-red-600" />
              <Card title="Sponsored" value={sponsored} color="text-purple-600" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 bg-white rounded-2xl shadow p-6">
                <div className="flex items-center gap-3 mb-5">
                  <FaChartLine className="text-blue-700 text-2xl" />
                  <div>
                    <h3 className="text-xl font-bold">Activities Growth</h3>
                    <p className="text-gray-500 text-sm">
                      Listings, users and payment growth overview
                    </p>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient
                          id="listingColor"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2563eb"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2563eb"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="listings"
                        stroke="#2563eb"
                        fill="url(#listingColor)"
                        strokeWidth={3}
                      />

                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#16a34a"
                        fillOpacity={0}
                        strokeWidth={3}
                      />

                      <Area
                        type="monotone"
                        dataKey="payments"
                        stroke="#9333ea"
                        fillOpacity={0}
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-xl font-bold mb-5">Listing Status</h3>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#1d4ed8"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold mb-4">Recent Listings</h3>

              <ListingTable
                listings={listings.slice(0, 5)}
                approveListing={approveListing}
                rejectListing={rejectListing}
                suspendListing={suspendListing}
                toggleFeatured={toggleFeatured}
              />
            </div>
          </>
        )}

        {activeTab === "listings" && (
          <div className="bg-white rounded-2xl shadow p-5">
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-5">
              <div className="flex items-center border rounded-xl px-3 w-full md:w-96">
                <FaSearch className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Search listing..."
                  className="p-3 outline-none w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="border p-3 rounded-xl"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            <ListingTable
              listings={filteredListings}
              approveListing={approveListing}
              rejectListing={rejectListing}
              suspendListing={suspendListing}
              toggleFeatured={toggleFeatured}
            />
          </div>
        )}


        {activeTab === "users" && (
          <SimpleTable
            title="Users"
            headers={["Name", "Email", "Phone", "Role"]}
            rows={users.map((u) => [
              u.name || "-",
              u.email || "-",
              u.phone || "-",
              u.role || "-",
            ])}
          />
        )}

        {activeTab === "payments" && (
          <SimpleTable
            title="Payments"
            headers={["ID", "Amount", "Status", "Created At"]}
            rows={payments.map((p) => [
              p.id || "-",
              p.amountPaise ? `₹${p.amountPaise / 100}` : "-",
              p.status || "-",
              p.createdAt ? new Date(p.createdAt).toLocaleString() : "-",
            ])}
          />
        )}

        {activeTab === "sponsored" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-5">Sponsored Listings</h3>

            <ListingTable
              listings={listings.filter((i) => i.isFeatured)}
              approveListing={approveListing}
              rejectListing={rejectListing}
              suspendListing={suspendListing}
              toggleFeatured={toggleFeatured}
            />
          </div>
        )}

        {activeTab === "enquiries" && (
          <SimpleTable
            title="Contact Form Enquiries"
            headers={["Name", "Email", "Phone", "Message", "Date"]}
            rows={enquiries.map((e) => [
              e.name || "-",
              e.email || "-",
              e.phone || "-",
              e.message || "-",
              e.createdAt ? new Date(e.createdAt).toLocaleString() : "-",
            ])}
          />
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-3xl">
            <h3 className="text-xl font-bold mb-5">Website Settings</h3>

            <div className="grid gap-4">
              <input className="border p-3 rounded-xl" defaultValue="Oye Rohini" />

              <input
                className="border p-3 rounded-xl"
                defaultValue="oyerohini@gmail.com"
              />

              <input
                className="border p-3 rounded-xl"
                defaultValue="+91 9876543210"
              />

              <button className="bg-blue-700 text-white py-3 rounded-xl">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Card({ title, value, color = "text-blue-700" }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition">
      <p className="text-gray-500">{title}</p>
      <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}

function ListingTable({
  listings,
  approveListing,
  rejectListing,
  suspendListing,
  toggleFeatured,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="p-4">Business</th>
            <th className="p-4">Category</th>
            <th className="p-4">City</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Status</th>
            <th className="p-4">Featured</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {listings.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-5 text-center text-gray-500">
                No listings found
              </td>
            </tr>
          ) : (
            listings.map((item) => {
              const category = item.category?.name || item.category || "-";
              const city = item.city?.name || item.city || "-";
              const phone = item.contactPhone || item.phone || "-";
              const status = item.status || "-";

              return (
                <tr key={item.id} className="border-b hover:bg-blue-50">
                  <td className="p-4 font-semibold">{item.name}</td>
                  <td className="p-4">{category}</td>
                  <td className="p-4">{city}</td>
                  <td className="p-4">{phone}</td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                      {status}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleFeatured(item.id, item.isFeatured)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.isFeatured
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.isFeatured ? "Yes" : "No"}
                    </button>
                  </td>

                  <td className="p-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => approveListing(item.id)}
                      className="bg-green-600 text-white p-2 rounded-lg"
                      title="Approve"
                    >
                      <FaCheck />
                    </button>

                    <button
                      onClick={() => rejectListing(item.id)}
                      className="bg-red-600 text-white p-2 rounded-lg"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>

                    <button
                      onClick={() => suspendListing(item.id)}
                      className="bg-gray-800 text-white p-2 rounded-lg"
                      title="Suspend"
                    >
                      <FaBan />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function SimpleTable({ title, headers, rows }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
      <h3 className="text-xl font-bold mb-5">{title}</h3>

      <table className="w-full text-left">
        <thead className="bg-blue-700 text-white">
          <tr>
            {headers.map((head) => (
              <th key={head} className="p-4">
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="p-5 text-center">
                No data found
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index} className="border-b">
                {row.map((cell, i) => (
                  <td key={i} className="p-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
