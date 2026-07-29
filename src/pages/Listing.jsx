import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSearch,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import toast from "react-hot-toast";

import FilterSidebar from "../components/FilterSidebar";
import { formatListingRating } from "../components/ReviewSection";
import {
  searchListings,
  getSavedListings,
  saveListing,
  removeSavedListing,
} from "../api/api";

const fallbackImage =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop";

export default function Listing() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [openNow, setOpenNow] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    const token = localStorage.getItem("token");
    if (token) {
      getSavedListings()
        .then((res) => {
          const list = res.data || [];
          setSavedListings(list.map((item) => item.listingId));
        })
        .catch((err) => console.log("Error fetching saved listings:", err));
    } else {
      setSavedListings([]);
    }
  };

  useEffect(() => {
    fetchSaved();
    window.addEventListener("saved-listings-updated", fetchSaved);
    return () => {
      window.removeEventListener("saved-listings-updated", fetchSaved);
    };
  }, []);

  const handleSaveListing = async (listingId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?redirect=${location.pathname}${location.search}`);
      return;
    }

    const isSaved = savedListings.includes(listingId);
    try {
      if (isSaved) {
        await removeSavedListing(listingId);
        setSavedListings((prev) => prev.filter((id) => id !== listingId));
        window.dispatchEvent(new CustomEvent("saved-listings-updated"));
        toast.success("Removed from saved listings", {
          position: "bottom-right",
        });
      } else {
        await saveListing(listingId);
        setSavedListings((prev) => [...prev, listingId]);
        window.dispatchEvent(new CustomEvent("saved-listings-updated"));
        toast((t) => (
          <div className="flex items-center justify-between w-full gap-4">
            <span className="text-gray-800 font-medium">✓ Listing saved successfully</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                window.dispatchEvent(new CustomEvent("open-saved-drawer"));
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition select-none cursor-pointer border-none"
            >
              View Saved
            </button>
          </div>
        ), {
          duration: 5000,
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.log("Error saving/removing listing:", err);
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
    }
  };

  const buildFetchParams = ({
    q = search,
    cityValue = city,
    categoryValue = category,
    ratingValue = minRating,
    priceValue = priceRange,
    openNowValue = openNow,
  } = {}) => ({
    ...(q ? { q } : {}),
    ...(cityValue ? { city: cityValue } : {}),
    ...(categoryValue ? { category: categoryValue } : {}),
    ...(ratingValue ? { minRating: ratingValue } : {}),
    ...(priceValue ? { priceRange: priceValue } : {}),
    ...(openNowValue ? { openNow: "true" } : {}),
  });

  const fetchListings = async (params = {}) => {
    try {
      setLoading(true);
      const res = await searchListings(params);
      const data = res.data?.items || res.data?.data || [];
      setListings(Array.isArray(data) ? data : []);
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
    const ratingParam = searchParams.get("minRating") || "";
    const priceParam = searchParams.get("priceRange") || "";
    const openNowParam = searchParams.get("openNow") === "true";

    setSearch(q);
    setCity(cityParam);
    setCategory(categoryParam);
    setMinRating(ratingParam);
    setPriceRange(priceParam);
    setOpenNow(openNowParam);

    const params = buildFetchParams({
      q,
      cityValue: cityParam,
      categoryValue: categoryParam,
      ratingValue: ratingParam,
      priceValue: priceParam,
      openNowValue: openNowParam,
    });

    fetchListings(
      Object.keys(params).length > 0 ? params : {}
    );
  }, [location.search]);

  const updateUrl = ({
    nextSearch = search,
    nextCity = city,
    nextCategory = category,
    nextRating = minRating,
    nextPriceRange = priceRange,
    nextOpenNow = openNow,
  } = {}) => {
    const params = new URLSearchParams();
    if (nextSearch) params.set("q", nextSearch);
    if (nextCity) params.set("city", nextCity);
    if (nextCategory) params.set("category", nextCategory);
    if (nextRating) params.set("minRating", nextRating);
    if (nextPriceRange) params.set("priceRange", nextPriceRange);
    if (nextOpenNow) params.set("openNow", "true");

    navigate(`/listings?${params.toString()}`);
  };

  const handleSearch = () => {
    updateUrl();
  };

  const handleCategoryChange = (value) => {
    const nextCategory = value === "All" ? "" : value;
    setCategory(nextCategory);
    updateUrl({ nextCategory });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCity("");
    setCategory("");
    setMinRating("");
    setPriceRange("");
    setOpenNow(false);
    navigate("/listings");
  };

  const formatPriceRange = (value) => {
    if (value === "BUDGET") return "Budget";
    if (value === "MID_RANGE") return "Mid Range";
    if (value === "PREMIUM") return "Premium";
    return "";
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
            selectedPrice={priceRange}
            selectedRating={minRating}
            openNow={openNow}
            onCategoryChange={handleCategoryChange}
            onPriceChange={setPriceRange}
            onRatingChange={setMinRating}
            onOpenNowChange={setOpenNow}
            onApply={handleSearch}
            onReset={handleResetFilters}
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold">Featured Businesses</h2>

                {priceRange && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing: {formatPriceRange(priceRange)}
                  </p>
                )}

                {minRating && (
                  <p className="text-sm text-yellow-600 mt-2">
                    Showing: {minRating} star & above
                  </p>
                )}

                {openNow && (
                  <p className="text-sm text-green-600 mt-2">
                    Showing: Open Now
                  </p>
                )}
              </div>

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
                    item.images?.find((img) => img.mediaType === "IMAGE" || !img.mediaType)?.url ||
                    item.images?.[0]?.url ||
                    item.imageUrl ||
                    fallbackImage;

                  const categoryName =
                    item.category?.name ||
                    item.categoryName ||
                    item.category ||
                    "Business";

                  const cityName =
                    item.city?.name ||
                    item.cityName ||
                    item.city ||
                    item.addressLine1 ||
                    "Location";

                  const phone =
                    item.contactPhone || item.phone || item.whatsappPhone || "";

                  return (
                    <div
                      key={item.id}
                      className="relative bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition duration-300"
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveListing(item.id);
                        }}
                        className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-600 p-2.5 rounded-full shadow transition border-none cursor-pointer"
                      >
                        {savedListings.includes(item.id) ? (
                          <FaBookmark className="text-blue-600" />
                        ) : (
                          <FaRegBookmark className="text-gray-400" />
                        )}
                      </button>

                      <img
                        src={image}
                        alt={item.name || "Business"}
                        className="h-56 w-full object-cover"
                      />

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="text-2xl font-bold">
                            {item.name || "Business Name"}
                          </h3>

                          <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold shrink-0">
                            <FaStar className="mr-1" />
                            {formatListingRating(item.rating, item.reviewCount)}
                          </div>
                        </div>

                        <p className="text-blue-600 font-medium mb-3">
                          {categoryName}
                        </p>

                        {item.priceRange && (
                          <p className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                            {formatPriceRange(item.priceRange)}
                          </p>
                        )}

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
