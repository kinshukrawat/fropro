import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
} from "react-icons/fa";

import FilterSidebar from "../components/FilterSidebar";
import API from "../api/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop";

export default function Listing() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchListings = async (params = {}) => {
    try {
      setLoading(true);

      const res = await API.get("/listings", {
        params,
      });
      

      const data = res.data?.items || res.data?.data || [];

      setListings(data);
    } catch (error) {
      console.log("Listings API Error:", error.response?.data || error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cityParam = searchParams.get("city") || "";
    const categoryParam = searchParams.get("category") || "";

    setSearch(q);
    setCity(cityParam);
    setCategory(categoryParam);

    fetchListings(
      [q, cityParam, categoryParam].some(Boolean)
        ? {
            ...(q ? { q } : {}),
            ...(cityParam ? { city: cityParam } : {}),
            ...(categoryParam ? { category: categoryParam } : {}),
          }
        : {}
    );
  }, [location.search]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (city) params.set("city", city);
    if (category) params.set("category", category);

    navigate(`/listings?${params.toString()}`);
  };

  const handleCategoryChange = (value) => {
    const nextCategory = value === "All" ? "" : value;
    setCategory(nextCategory);

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (city) params.set("city", city);
    if (nextCategory) params.set("category", nextCategory);

    navigate(`/listings?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCity("");
    setCategory("");
    navigate("/listings");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            Explore Listings
          </h1>

          <p className="text-lg text-blue-100 mb-8">
            Find the best local businesses near you
          </p>

          <div className="bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3 shadow-xl">
            <div className="flex items-center flex-1 border rounded-lg px-4 py-3">
              <FaSearch className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full outline-none text-black"
              />
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            selectedCategory={category || "All"}
            onCategoryChange={handleCategoryChange}
            onApply={handleSearch}
            onReset={handleResetFilters}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold">Featured Businesses</h2>
              <p className="text-gray-500">{listings.length} Listings Found</p>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading listings...</p>
            ) : listings.length === 0 ? (
              <p className="text-center text-gray-500">No listings found.</p>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {listings.map((item) => {
                  const image =
                    item.images?.[0]?.url || item.imageUrl || fallbackImage;

                  const categoryName =
                    item.category?.name || item.categoryName || item.category || "Business";

                  const cityName =
                    item.city?.name || item.cityName || item.city || item.addressLine1 || "Location";

                  const phone = item.contactPhone || item.phone || item.whatsappPhone || "";

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition duration-300"
                    >
                      <img
                        src={image}
                        alt={item.name || "Business"}
                        className="h-56 w-full object-cover"
                      />

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-bold">
                            {item.name || "Business Name"}
                          </h3>

                          <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                            <FaStar className="mr-1" />
                            {item.rating || "New"}
                          </div>
                        </div>

                        <p className="text-blue-600 font-medium mb-3">
                          {categoryName}
                        </p>

                        <div className="flex items-center text-gray-500 mb-6">
                          <FaMapMarkerAlt className="mr-2" />
                          {cityName}
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                          <Link
                            to={`/business/detail/${item.slug || item.id}`}
                            className="flex-1"
                          >
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition">
                              View Details
                            </button>
                          </Link>

                          <a
                            href={phone ? `tel:${phone}` : "#"}
                            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-xl transition"
                          >
                            <FaPhoneAlt className="text-blue-600" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
