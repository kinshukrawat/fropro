import { useEffect, useMemo, useState } from "react";
import {
  FaEnvelopeOpenText,
  FaTag,
  FaCheckCircle,
  FaStore,
  FaClipboardList,
  FaStar,
  FaChartLine,
  FaHome,
  FaCalendarAlt,
  FaRegStar,
  FaWallet,
  FaComments,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaCrown,
  FaBell,
  FaSearch,
  FaPlusCircle,
  FaEye,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaBuilding,
  FaListUl,
  FaImage,
  FaClock,
} from "react-icons/fa";

import API, {
  getCategories,
  getCities,
  getMyListings,
} from "../api/api";

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    categoryId: "",
    cityId: "",
    opensAt: "",
    closesAt: "",
  });

  const fetchMyListings = async () => {
    try {
      const res = await getMyListings();
      setListings(res.data?.items || res.data || []);
    } catch (error) {
      console.log("My Listings Error:", error.response?.data || error);
    }
  };

  const fetchOwnerFinance = async () => {
    return Promise.resolve();
  };

  const fetchDropdownData = async () => {
    try {
      const categoryRes = await getCategories();
      const cityRes = await getCities();

      setCategories(categoryRes.data?.items || categoryRes.data || []);
      setCities(cityRes.data?.items || cityRes.data || []);
    } catch (error) {
      console.log("Dropdown Error:", error.response?.data || error);
    }
  };

  const fetchOwnerMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await API.get("/messages/owner");
      setMessages(res.data?.items || res.data?.data || res.data || []);
    } catch (error) {
      console.log("Messages Error:", error.response?.data || error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
    fetchDropdownData();
    fetchOwnerFinance();
    fetchOwnerMessages();
  }, []);

  const stats = useMemo(() => {
    const approved = listings.filter(
      (item) => item.status?.toLowerCase() === "approved"
    ).length;

    const pending = listings.filter(
      (item) =>
        item.status?.toLowerCase() === "pending" ||
        item.status?.toLowerCase() === "submitted"
    ).length;

    return {
      total: listings.length,
      approved,
      pending,
      rating: 0,
    };
  }, [listings]);

  const getCategoryName = (id) => {
    return categories.find((cat) => String(cat.id) === String(id))?.name || "—";
  };

  const getCityName = (id) => {
    return cities.find((city) => String(city.id) === String(id))?.name || "—";
  };

  const getStatusStyle = (status = "Draft") => {
    const s = status.toLowerCase();

    if (s === "approved") return "bg-green-100 text-green-700 border-green-200";
    if (s === "rejected") return "bg-red-100 text-red-700 border-red-200";
    if (s === "pending" || s === "submitted")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getMessageStatusStyle = (status = "new") => {
    const s = status?.toLowerCase();
    if (s === "contacted") return "bg-green-100 text-green-700";
    if (s === "new") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    setImageFiles(validFiles);
    setImagePreviews(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      phone: "",
      categoryId: "",
      cityId: "",
      opensAt: "",
      closesAt: "",
    });

    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        cityId: formData.cityId,
        contactPhone: formData.phone,
        whatsappPhone: formData.phone,
        addressLine1: formData.address,
        services: ["General Service"],
        opensAt: formData.opensAt,
        closesAt: formData.closesAt,
      };

      const listingRes = await API.post("/listings", payload);

      const createdListing =
        listingRes.data?.data || listingRes.data?.item || listingRes.data;

      const listingId = createdListing?.id;

      if (imageFiles.length && listingId) {
        for (const file of imageFiles) {
          const uploadForm = new FormData();
          uploadForm.append("file", file);

          const uploadRes = await API.post("/uploads/image", uploadForm, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          await API.post("/uploads/listing-images", {
            listingId,
            url: uploadRes.data.url,
            cloudinaryId: uploadRes.data.cloudinaryId,
            altText: formData.name,
          });
        }
      }

      alert("Business listing created successfully");
      clearForm();
      fetchMyListings();
    } catch (error) {
      console.log("FULL ERROR:", error.response?.data || error);
      alert(JSON.stringify(error.response?.data || "Failed to add listing"));
    } finally {
      setLoading(false);
    }
  };

  const submitForApproval = async (id) => {
    try {
      await API.post(`/listings/${id}/submit`);
      alert("Listing submitted for approval");
      fetchMyListings();
    } catch (error) {
      console.log("Submit Error:", error.response?.data || error);
      alert("Failed to submit listing");
    }
  };

  const tabTitle = {
    myBusiness: "My Business",
    bookings: "Bookings",
    reviews: "Reviews",
    analytics: "Analytics",
    payments: "Payments",
    messages: "Messages",
    profile: "Profile",
    settings: "Settings",
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex text-gray-900">
      <aside className="w-72 bg-[#07111f] text-white p-5 hidden lg:flex flex-col justify-between">
        <div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 mb-8 shadow-lg">
            <p className="text-sm text-blue-100">Welcome back!</p>
            <h2 className="text-xl font-bold mt-1">Business Owner</h2>
            <p className="text-sm text-blue-100 mt-1">Manage your listings</p>
          </div>

          <p className="text-xs text-gray-400 mb-3 px-2">MAIN MENU</p>

          <div className="space-y-2">
            {[
              [FaHome, "Dashboard", "dashboard"],
              [FaStore, "My Business", "myBusiness"],
              [FaCalendarAlt, "Bookings", "bookings"],
              [FaRegStar, "Reviews", "reviews"],
              [FaChartLine, "Analytics", "analytics"],
              [FaWallet, "Payments", "payments"],
              [FaComments, "Messages", "messages"],
              [FaUser, "Profile", "profile"],
              [FaCog, "Settings", "settings"],
            ].map(([Icon, label, tab]) => (
              <button
                key={label}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === tab
                    ? "bg-blue-600 shadow-lg"
                    : "hover:bg-white/10 text-gray-200"
                }`}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-white/10 rounded-2xl p-5 text-center">
            <FaCrown className="text-yellow-400 text-3xl mx-auto mb-3" />
            <h3 className="font-bold">Grow Your Business</h3>
            <p className="text-sm text-gray-300 mt-2">
              Upgrade to premium and get more visibility.
            </p>
            <button
              onClick={() => setActiveTab("payments")}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-xl"
            >
              Upgrade Now
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      <main className="flex-1">
        <div className="bg-white border-b px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:w-[430px]">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings, categories, services..."
              className="w-full border rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative bg-gray-100 p-3 rounded-full">
              <FaBell />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <FaUser />
              </div>
              <div>
                <p className="font-bold">Business Owner</p>
                <p className="text-sm text-gray-500">Owner</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">
              {activeTab === "dashboard"
                ? "Business Dashboard"
                : tabTitle[activeTab]}
            </h1>
            <p className="text-gray-500 mt-2">
              Dashboard /{" "}
              {activeTab === "dashboard" ? "Overview" : tabTitle[activeTab]}
            </p>
          </div>

          {activeTab !== "dashboard" && (
            <div className="bg-white rounded-3xl border shadow-sm p-10">
              {activeTab === "payments" ? (
                <>
                  <h2 className="text-3xl font-bold mb-3">Premium Plans</h2>
                  <p className="text-gray-500 mb-8">
                    Upgrade your business listing for more visibility and leads.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      ["3 Months", "₹999", "Basic visibility boost"],
                      ["6 Months", "₹1799", "Recommended for growing business"],
                      ["12 Months", "₹2999", "Best value yearly plan"],
                    ].map(([plan, price, desc]) => (
                      <div key={plan} className="border rounded-3xl p-6 hover:shadow-lg">
                        <h3 className="text-xl font-bold">{plan}</h3>
                        <p className="text-3xl font-bold text-blue-600 my-4">{price}</p>
                        <p className="text-gray-500 mb-6">{desc}</p>

                        <button
                          onClick={() =>
                            alert("Razorpay integration next step me add karenge")
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold"
                        >
                          Choose Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : activeTab === "messages" ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-3xl font-bold">Customer Messages</h2>
                      <p className="text-gray-500 mt-1">
                        Enquiries received via{" "}
                        <strong>Ask for Price</strong> on your business listings.
                      </p>
                    </div>
                    <button
                      onClick={fetchOwnerMessages}
                      className="flex items-center gap-2 px-5 py-2.5 border border-blue-600 text-blue-600 rounded-2xl hover:bg-blue-50 font-semibold transition"
                    >
                      <FaEnvelopeOpenText />
                      Refresh
                    </button>
                  </div>

                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-20 text-gray-400 text-lg">
                      <svg
                        className="animate-spin h-6 w-6 mr-3 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <FaComments className="text-5xl mb-4 text-gray-200" />
                      <p className="text-lg font-medium">No customer messages yet.</p>
                      <p className="text-sm mt-1">
                        When customers enquire about your listings, they'll appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between gap-4">
                            <div className="flex-1">
                              {/* Customer name + status badge row */}
                              <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {msg.name || "Unknown Customer"}
                                </h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getMessageStatusStyle(
                                    msg.status
                                  )}`}
                                >
                                  {msg.status || "New"}
                                </span>
                              </div>

                              {/* Contact info */}
                              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500 mb-4">
                                {msg.email && (
                                  <span className="flex items-center gap-1.5">
                                    <FaEnvelopeOpenText className="text-gray-400" />
                                    {msg.email}
                                  </span>
                                )}
                                {msg.phone && (
                                  <span className="flex items-center gap-1.5">
                                    <FaPhoneAlt className="text-gray-400" />
                                    {msg.phone}
                                  </span>
                                )}
                              </div>

                              {/* Listing & service */}
                              <div className="space-y-2 text-sm">
                                <p>
                                  <span className="font-semibold text-gray-700">Business:</span>{" "}
                                  <span className="text-gray-600">
                                    {msg.listingName || msg.listing?.name || "—"}
                                  </span>
                                </p>

                                {msg.serviceTitle && (
                                  <p>
                                    <span className="font-semibold text-gray-700">
                                      Asked About:
                                    </span>{" "}
                                    <span className="text-gray-600">{msg.serviceTitle}</span>
                                  </p>
                                )}

                                {msg.message && (
                                  <div>
                                    <p className="font-semibold text-gray-700 mb-1">Message:</p>
                                    <div className="bg-gray-50 border rounded-xl p-3 text-gray-700 leading-relaxed">
                                      {msg.message}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right column: date + actions */}
                            <div className="flex flex-col items-start md:items-end justify-between gap-4 md:min-w-[180px]">
                              <span className="text-sm text-gray-400">
                                {msg.createdAt
                                  ? new Date(msg.createdAt).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "—"}
                              </span>

                              <div className="flex flex-wrap gap-2">
                                {msg.phone && (
                                  <a
                                    href={`tel:${msg.phone}`}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition"
                                  >
                                    <FaPhoneAlt className="text-xs" />
                                    Call
                                  </a>
                                )}

                                {msg.email && (
                                  <a
                                    href={`mailto:${msg.email}`}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
                                  >
                                    <FaEnvelopeOpenText className="text-xs" />
                                    Email
                                  </a>
                                )}

                                <button
                                  type="button"
                                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 text-sm font-medium text-gray-700 transition"
                                >
                                  <FaCheckCircle className="text-xs text-gray-400" />
                                  Mark Contacted
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-3">{tabTitle[activeTab]}</h2>
                  <p className="text-gray-500">
                    This section is ready. Backend integration will be added next.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "dashboard" && (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<FaStore />}
                  title="Total Businesses"
                  value={stats.total}
                  subtitle="Active Listings"
                  color="blue"
                />
                <StatCard
                  icon={<FaClipboardList />}
                  title="Pending Listings"
                  value={stats.pending}
                  subtitle="Waiting approval"
                  color="green"
                />
                <StatCard
                  icon={<FaStar />}
                  title="Average Rating"
                  value={stats.rating}
                  subtitle="Total Reviews"
                  color="yellow"
                />
                <StatCard
                  icon={<FaChartLine />}
                  title="Approved Listings"
                  value={stats.approved}
                  subtitle="Live on website"
                  color="red"
                />
              </div>

              <div className="grid xl:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-3xl shadow-sm border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                      <FaPlusCircle />
                    </div>
                    <h2 className="text-2xl font-bold">Add Business Listing</h2>
                  </div>

                  <form
                    onSubmit={handleAddListing}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    <InputBox
                      icon={<FaBuilding />}
                      label="Business Name"
                      name="name"
                      placeholder="Enter business name"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    <InputBox
                      icon={<FaPhoneAlt />}
                      label="Phone Number"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                    <InputBox
                      icon={<FaMapMarkerAlt />}
                      label="Business Address"
                      name="address"
                      placeholder="Shop No, Landmark, Sector, Rohini, Delhi, Pincode"
                      value={formData.address}
                      onChange={handleChange}
                    />

                    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
                      <label className="text-sm text-gray-500">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full outline-none bg-transparent mt-2"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <TimeInputBox
                      icon={<FaClock />}
                      label="Opening Time"
                      name="opensAt"
                      value={formData.opensAt}
                      onChange={handleChange}
                    />

                    <TimeInputBox
                      icon={<FaClock />}
                      label="Closing Time"
                      name="closesAt"
                      value={formData.closesAt}
                      onChange={handleChange}
                    />

                    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500 md:col-span-2">
                      <label className="text-sm text-gray-500">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="cityId"
                        value={formData.cityId}
                        onChange={handleChange}
                        className="w-full outline-none bg-transparent mt-2"
                        required
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="border rounded-2xl px-4 py-3 md:col-span-2">
                      <label className="text-sm text-gray-500">
                        Business Images / Gallery
                      </label>

                      <div className="flex items-center gap-3 mt-3">
                        <FaImage className="text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="w-full"
                        />
                      </div>

                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                          {imagePreviews.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt=""
                              className="w-full h-32 object-cover rounded-xl border"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500 md:col-span-2">
                      <label className="text-sm text-gray-500">
                        Business Description{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        placeholder="Write about your business, services, experience..."
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full mt-2 outline-none resize-none"
                        rows="5"
                        required
                      />
                      <p className="text-right text-xs text-gray-400">
                        {formData.description.length}/500
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearForm}
                      className="border hover:bg-gray-50 py-3 rounded-2xl font-semibold"
                    >
                      Clear Form
                    </button>

                    <button
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold disabled:opacity-60"
                    >
                      {loading ? "Adding..." : "Add Listing"}
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border p-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl">
                      <FaChartLine />
                    </div>
                    <h2 className="text-2xl font-bold">Business Overview</h2>
                  </div>

                  <div className="h-72 flex items-end gap-4 border-b border-l p-4">
                    {[35, 25, 52, 43, 75, 58, 68].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-300"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-400">
                          {
                            [
                              "May",
                              "Jun 5",
                              "Jun 10",
                              "Jun 15",
                              "Jun 20",
                              "Jun 25",
                              "Now",
                            ][index]
                          }
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <MiniStat title="Page Views" value="120" growth="+18%" />
                    <MiniStat
                      title="Search Appearances"
                      value="85"
                      growth="+12%"
                    />
                    <MiniStat title="Profile Clicks" value="24" growth="+8%" />
                    <MiniStat title="Phone Clicks" value="15" growth="+5%" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                      <FaListUl />
                    </div>
                    <h2 className="text-2xl font-bold">My Listings</h2>
                  </div>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold">
                    View All Listings
                  </button>
                </div>

                {listings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No listings added yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] border rounded-2xl overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4">Business Name</th>
                          <th className="text-left p-4">Category</th>
                          <th className="text-left p-4">City</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {listings.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t hover:bg-gray-50"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden">
                                  {item.images?.[0]?.url ? (
                                    <img
                                      src={item.images[0].url}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FaStore />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold">{item.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {item.addressLine1 ||
                                      item.address ||
                                      "No address"}
                                  </p>
                                  {item.opensAt && item.closesAt && (
                                    <p className="text-xs text-gray-400 mt-1">
                                      {item.opensAt} - {item.closesAt}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                                {item.category?.name ||
                                  getCategoryName(item.categoryId)}
                              </span>
                            </td>

                            <td className="p-4">
                              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                {item.city?.name || getCityName(item.cityId)}
                              </span>
                            </td>

                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full border text-sm ${getStatusStyle(
                                  item.status
                                )}`}
                              >
                                {item.status || "Draft"}
                              </span>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button className="border p-3 rounded-xl hover:bg-gray-100">
                                  <FaEye />
                                </button>

                                {item.status?.toLowerCase() !== "approved" && (
                                  <button
                                    onClick={() => submitForApproval(item.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl flex items-center gap-2"
                                  >
                                    <FaPaperPlane />
                                    Submit
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          <p className="text-center text-sm text-gray-400 mt-8">
            © 2026 Oye Rohini. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-3xl border shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
        <p className="text-sm text-gray-400 mt-3">{subtitle}</p>
      </div>

      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${colors[color]}`}
      >
        {icon}
      </div>
    </div>
  );
}

function InputBox({ icon, label, name, placeholder, value, onChange }) {
  return (
    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
      <label className="text-sm text-gray-500">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-gray-400">{icon}</span>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full outline-none"
          required
        />
      </div>
    </div>
  );
}

function TimeInputBox({ icon, label, name, value, onChange }) {
  return (
    <div className="border rounded-2xl px-4 py-3 focus-within:border-blue-500">
      <label className="text-sm text-gray-500">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-gray-400">{icon}</span>
        <input
          type="time"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full outline-none"
          required
        />
      </div>
    </div>
  );
}

function MiniStat({ title, value, growth }) {
  return (
    <div className="border rounded-2xl p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="flex items-center justify-between mt-2">
        <h4 className="text-2xl font-bold">{value}</h4>
        <span className="text-green-600 text-sm">{growth}</span>
      </div>
    </div>
  );
}
