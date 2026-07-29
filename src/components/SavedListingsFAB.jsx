import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookmark, FaRegBookmark, FaStar, FaMapMarkerAlt, FaTimes, FaTrashAlt } from "react-icons/fa";
import { getSavedListings, removeSavedListing } from "../api/api";
import { formatListingRating } from "./ReviewSection";

const fallbackImage =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop";

export default function SavedListingsFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const fetchListings = async () => {
    if (!localStorage.getItem("token")) return;
    try {
      setLoading(true);
      const res = await getSavedListings();
      setSavedListings(res.data || []);
    } catch (err) {
      console.error("Error fetching saved listings in FAB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check login state periodically or on change
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkLogin();
    fetchListings();

    const handleUpdate = () => {
      checkLogin();
      fetchListings();
    };

    const handleOpen = () => {
      checkLogin();
      setIsOpen(true);
      fetchListings();
    };

    window.addEventListener("saved-listings-updated", handleUpdate);
    window.addEventListener("open-saved-drawer", handleOpen);

    // Poll for token presence (in case of login/logout without page refresh)
    const interval = setInterval(checkLogin, 1000);

    return () => {
      window.removeEventListener("saved-listings-updated", handleUpdate);
      window.removeEventListener("open-saved-drawer", handleOpen);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && isOpen) {
      fetchListings();
    }
  }, [isOpen, isLoggedIn]);

  const handleRemove = async (e, listingId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeSavedListing(listingId);
      setSavedListings((prev) => prev.filter((item) => item.listingId !== listingId));
      // Notify other components (like Listing cards) that an item was unsaved
      window.dispatchEvent(new CustomEvent("saved-listings-updated"));
    } catch (err) {
      console.error("Error removing listing in FAB:", err);
      alert("Something went wrong");
    }
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-3.5 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition duration-300 flex items-center gap-2 font-semibold select-none cursor-pointer border-none outline-none"
      >
        <FaBookmark />
        <span>Saved</span>
        {savedListings.length > 0 && (
          <span className="bg-white text-blue-600 rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
            {savedListings.length}
          </span>
        )}
      </button>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-45 transition-opacity duration-300"
        />
      )}

      {/* Right Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <FaBookmark className="text-blue-600" />
            <span>Saved Listings</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer border-none bg-transparent"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && savedListings.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Loading saved listings...</div>
          ) : savedListings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                <FaRegBookmark />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Saved Listings Yet</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Save your favourite businesses to access them later.
              </p>
            </div>
          ) : (
            savedListings.map(({ id, listing }) => {
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

              return (
                <div
                  key={listing.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition duration-200"
                >
                  <img
                    src={image}
                    alt={listing.name || "Business"}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-gray-950 text-sm truncate">
                          {listing.name || "Business Name"}
                        </h4>
                        <button
                          onClick={(e) => handleRemove(e, listing.id)}
                          className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer border-none bg-transparent"
                          title="Remove saved"
                        >
                          <FaTrashAlt className="text-xs" />
                        </button>
                      </div>
                      <p className="text-xs text-blue-600 font-medium mt-0.5">{categoryName}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[10px]" />
                        <span className="truncate">{cityName}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-150">
                      {listing.rating !== undefined && (
                        <div className="flex items-center text-xs font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                          <FaStar className="mr-0.5 text-yellow-500 text-[10px]" />
                          {formatListingRating(listing.rating, listing.reviewCount)}
                        </div>
                      )}
                      <Link
                        to={`/business/detail/${listing.slug || listing.id}`}
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-blue-600 font-bold hover:underline ml-auto"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
