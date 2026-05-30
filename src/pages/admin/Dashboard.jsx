import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaList,
  FaPlus,
  FaUsers,
  FaRupeeSign,
  FaStar,
  FaCrown,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
  { id: "listings", label: "Listings", icon: <FaList /> },
  { id: "add", label: "Add Listing", icon: <FaPlus /> },
  { id: "categories", label: "Categories", icon: <FaStar /> },
  { id: "users", label: "Users", icon: <FaUsers /> },
  { id: "payments", label: "Payments", icon: <FaRupeeSign /> },
  { id: "sponsored", label: "Sponsored", icon: <FaCrown /> },
  { id: "enquiries", label: "Enquiries", icon: <FaEnvelope /> },
  { id: "settings", label: "Settings", icon: <FaCog /> },
];

const defaultListings = [
  {
    id: 1,
    name: "Urban Salon",
    category: "Salon",
    location: "Rohini Sector 7",
    phone: "9876543210",
    status: "Pending",
    sponsored: false,
  },
  {
    id: 2,
    name: "Fit Gym Club",
    category: "Gym",
    location: "Rohini Sector 11",
    phone: "9876543211",
    status: "Approved",
    sponsored: true,
  },
];

const defaultCategories = ["Salon", "Gym", "Cafe", "Restaurant", "Doctor"];

const defaultUsers = [
  { id: 1, name: "Business Owner", email: "owner@oyerohini.com", role: "Owner" },
  { id: 2, name: "Normal User", email: "user@oyerohini.com", role: "User" },
];

const defaultPayments = [
  {
    id: "PAY123",
    business: "Fit Gym Club",
    amount: 2999,
    plan: "6 Months",
    status: "Paid",
  },
];

const defaultEnquiries = [
  {
    id: 1,
    name: "Rahul",
    mobile: "9999999999",
    business: "Urban Salon",
    message: "Need appointment details",
    status: "New",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    phone: "",
  });

  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const isLogin = localStorage.getItem("adminLogin");

    if (isLogin !== "true") {
      navigate("/admin/login");
      return;
    }

    const savedListings = JSON.parse(localStorage.getItem("adminListings"));

    if (savedListings) {
      setListings(savedListings);
    } else {
      setListings(defaultListings);
      localStorage.setItem("adminListings", JSON.stringify(defaultListings));
    }
  }, [navigate]);

  const saveListings = (data) => {
    setListings(data);
    localStorage.setItem("adminListings", JSON.stringify(data));
  };

  const totalListings = listings.length;
  const approved = listings.filter((i) => i.status === "Approved").length;
  const pending = listings.filter((i) => i.status === "Pending").length;
  const rejected = listings.filter((i) => i.status === "Rejected").length;
  const sponsored = listings.filter((i) => i.sponsored).length;

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "All" || item.status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [listings, search, filterStatus]);

  const logout = () => {
    localStorage.removeItem("adminLogin");
    navigate("/admin/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.location || !form.phone) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      const updated = listings.map((item) =>
        item.id === editId ? { ...item, ...form } : item
      );

      saveListings(updated);
      setEditId(null);
    } else {
      const newListing = {
        id: Date.now(),
        ...form,
        status: "Pending",
        sponsored: false,
      };

      saveListings([...listings, newListing]);
    }

    setForm({
      name: "",
      category: "",
      location: "",
      phone: "",
    });

    setActiveTab("listings");
  };

  const editListing = (item) => {
    setEditId(item.id);

    setForm({
      name: item.name,
      category: item.category,
      location: item.location,
      phone: item.phone,
    });

    setActiveTab("add");
  };

  const deleteListing = (id) => {
    if (window.confirm("Delete this listing?")) {
      saveListings(listings.filter((item) => item.id !== id));
    }
  };

  const updateStatus = (id, status) => {
    saveListings(
      listings.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const toggleSponsored = (id) => {
    saveListings(
      listings.map((item) =>
        item.id === id
          ? { ...item, sponsored: !item.sponsored }
          : item
      )
    );
  };

  const addCategory = (e) => {
    e.preventDefault();

    if (!newCategory.trim()) return;

    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const deleteCategory = (cat) => {
    setCategories(categories.filter((item) => item !== cat));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-900 text-white min-h-screen p-6 hidden md:block">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Oye Rohini Admin
        </h1>

        <p className="text-blue-200 text-sm mt-1">
          Control Panel
        </p>

        <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full my-6"></div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id
                  ? "bg-white text-blue-900 shadow-lg scale-105 border-l-4 border-cyan-400"
                  : "hover:bg-blue-800 hover:translate-x-2 hover:shadow-md"
              }`}
            >
              <span className="text-lg transition-transform duration-300 group-hover:scale-125">
                {item.icon}
              </span>

              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white mt-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 border border-slate-600"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-semibold tracking-wide">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="bg-white p-5 rounded-2xl shadow mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            <p className="text-gray-500">
              Manage Oye Rohini platform
            </p>
          </div>

          <button
            onClick={logout}
            className="md:hidden bg-gradient-to-r from-slate-700 to-slate-900 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
              <Card title="Total Listings" value={totalListings} />
              <Card title="Approved" value={approved} color="text-green-600" />
              <Card title="Pending" value={pending} color="text-yellow-600" />
              <Card title="Rejected" value={rejected} color="text-red-600" />
              <Card title="Sponsored" value={sponsored} color="text-purple-600" />
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-xl font-bold mb-4">
                Recent Listings
              </h3>

              <ListingTable
                listings={listings.slice(0, 5)}
                updateStatus={updateStatus}
                editListing={editListing}
                deleteListing={deleteListing}
                toggleSponsored={toggleSponsored}
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
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>

            <ListingTable
              listings={filteredListings}
              updateStatus={updateStatus}
              editListing={editListing}
              deleteListing={deleteListing}
              toggleSponsored={toggleSponsored}
            />
          </div>
        )}

        {activeTab === "add" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-3xl">
            <h3 className="text-xl font-bold mb-5">
              {editId ? "Edit Listing" : "Add New Listing"}
            </h3>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                className="border p-3 rounded-xl"
                placeholder="Business Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <select
                className="border p-3 rounded-xl"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <input
                className="border p-3 rounded-xl"
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />

              <input
                className="border p-3 rounded-xl"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <button className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-300">
                {editId ? "Update Listing" : "Add Listing"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-3xl">
            <h3 className="text-xl font-bold mb-5">
              Categories
            </h3>

            <form onSubmit={addCategory} className="flex gap-3 mb-5">
              <input
                className="border p-3 rounded-xl flex-1"
                placeholder="Add category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 rounded-xl transition">
                Add
              </button>
            </form>

            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="border rounded-xl p-4 flex justify-between hover:bg-gray-50 transition"
                >
                  <span>{cat}</span>

                  <button
                    onClick={() => deleteCategory(cat)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <SimpleTable
            title="Users"
            headers={["Name", "Email", "Role"]}
            rows={defaultUsers.map((u) => [u.name, u.email, u.role])}
          />
        )}

        {activeTab === "payments" && (
          <SimpleTable
            title="Payments / Subscriptions"
            headers={["Payment ID", "Business", "Amount", "Plan", "Status"]}
            rows={defaultPayments.map((p) => [
              p.id,
              p.business,
              `₹${p.amount}`,
              p.plan,
              p.status,
            ])}
          />
        )}

        {activeTab === "sponsored" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-5">
              Sponsored Listings
            </h3>

            <ListingTable
              listings={listings.filter((i) => i.sponsored)}
              updateStatus={updateStatus}
              editListing={editListing}
              deleteListing={deleteListing}
              toggleSponsored={toggleSponsored}
            />
          </div>
        )}

        {activeTab === "enquiries" && (
          <SimpleTable
            title="Enquiries / Leads"
            headers={["Name", "Mobile", "Business", "Message", "Status"]}
            rows={defaultEnquiries.map((e) => [
              e.name,
              e.mobile,
              e.business,
              e.message,
              e.status,
            ])}
          />
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow p-6 max-w-3xl">
            <h3 className="text-xl font-bold mb-5">
              Website Settings
            </h3>

            <div className="grid gap-4">
              <input
                className="border p-3 rounded-xl"
                defaultValue="Oye Rohini"
              />

              <input
                className="border p-3 rounded-xl"
                defaultValue="oyerohini@gmail.com"
              />

              <input
                className="border p-3 rounded-xl"
                defaultValue="+91 9876543210"
              />

              <input
                className="border p-3 rounded-xl"
                defaultValue="https://instagram.com/oyerohini_"
              />

              <button className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl transition">
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
    <div className="bg-white rounded-2xl shadow p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <p className="text-gray-500">{title}</p>
      <h3 className={`text-3xl font-bold ${color}`}>
        {value}
      </h3>
    </div>
  );
}

function ListingTable({
  listings,
  updateStatus,
  editListing,
  deleteListing,
  toggleSponsored,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="p-4">Business</th>
            <th className="p-4">Category</th>
            <th className="p-4">Location</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Status</th>
            <th className="p-4">Sponsored</th>
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
            listings.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-blue-50 transition"
              >
                <td className="p-4 font-semibold">{item.name}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4">{item.location}</td>
                <td className="p-4">{item.phone}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => toggleSponsored(item.id)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      item.sponsored
                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {item.sponsored ? "Yes" : "No"}
                  </button>
                </td>

                <td className="p-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(item.id, "Approved")}
                    className="bg-green-600 hover:bg-green-700 hover:scale-110 text-white p-2 rounded-lg transition"
                  >
                    <FaCheck />
                  </button>

                  <button
                    onClick={() => updateStatus(item.id, "Rejected")}
                    className="bg-red-600 hover:bg-red-700 hover:scale-110 text-white p-2 rounded-lg transition"
                  >
                    <FaTimes />
                  </button>

                  <button
                    onClick={() => editListing(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 hover:scale-110 text-white p-2 rounded-lg transition"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => deleteListing(item.id)}
                    className="bg-gray-800 hover:bg-black hover:scale-110 text-white p-2 rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SimpleTable({ title, headers, rows }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
      <h3 className="text-xl font-bold mb-5">
        {title}
      </h3>

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
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-b hover:bg-blue-50 transition"
            >
              {row.map((cell, i) => (
                <td key={i} className="p-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}