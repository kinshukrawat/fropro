import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaStar, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { getSavedListings, removeSavedListing } from "../api/api";
import { formatListingRating } from "../components/ReviewSection";

const fallbackImage =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop";

export default function SavedListings() {
  const navigate = useNavigate();
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login?redirect=/saved-listings");
      return;
    }

    fetchSavedListings();
  }, [navigate]);

  const fetchSavedListings = async () => {
    try {
      setLoading(true);
      const res = await getSavedListings();
      setSavedListings(res.data || []);
    } catch (error) {
      console.log("Error fetching saved listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (listingId) => {
    try {
      await removeSavedListing(listingId);
      setSavedListings((prev) => prev.filter((item) => item.listingId !== listingId));
      alert("Removed from saved listings");
    } catch (error) {
      console.log("Error removing saved listing:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Saved Listings</h1>
        <p className="text-gray-500 mb-10">Access your bookmarked businesses and services</p>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading saved listings...</div>
        ) : savedListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg max-w-xl mx-auto">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <FaHeart />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Saved Listings</h2>
            <p className="text-gray-500 mb-8">
              Explore businesses and save them to your list to access them later.
            </p>
            <Link
              to="/listings"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition"
            >
              Explore Businesses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {savedListings.map(({ id, listing }) => {
              if (!listing) return null;

              const image =
                listing.images?.find((img) => img.mediaType === "IMAGE" || !img.mediaType)?.url ||
                listing.images?.[0]?.url ||
                listing.imageUrl ||
                fallbackImage;

              const categoryName =
                listing.category?.name ||
                listing.categoryName ||
                listing.category ||
                "Business";

              const cityName =
                listing.city?.name ||
                listing.cityName ||
                listing.city ||
                listing.addressLine1 ||
                "Location";

              const phone =
                listing.contactPhone || listing.phone || listing.whatsappPhone || "";

              return (
                <div
                  key={listing.id}
                  className="relative bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition duration-300"
                >
                  <button
                    onClick={() => handleRemoveSaved(listing.id)}
                    className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-red-500 p-2.5 rounded-full shadow transition"
                  >
                    <FaHeart />
                  </button>

                  <div className="overflow-hidden">
                    <img
                      src={image}
                      alt={listing.name || "Business"}
                      className="h-52 w-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-950 truncate max-w-[70%]">
                        {listing.name || "Business Name"}
                      </h3>

                      <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold shrink-0">
                        <FaStar className="mr-1" />
                        {formatListingRating(listing.rating, listing.reviewCount)}
                      </div>
                    </div>

                    <p className="text-blue-600 font-medium text-sm mb-3">
                      {categoryName}
                    </p>

                    <div className="flex items-center text-gray-500 mb-6 text-sm">
                      <FaMapMarkerAlt className="mr-2" />
                      {cityName}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/business/detail/${listing.slug || listing.id}`}
                        className="flex-1"
                      >
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition text-sm">
                          Details
                        </button>
                      </Link>

                      {phone && (
                        <a
                          href={`tel:${phone}`}
                          className="bg-gray-100 hover:bg-gray-200 p-4 rounded-xl transition"
                        >
                          <FaPhoneAlt className="text-blue-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
