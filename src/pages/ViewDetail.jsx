import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaGlobe,
  FaDirections,
  FaCheckCircle,
  FaCar,
  FaRegStar,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";

import API from "../api/api";

export default function ViewDetail() {
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Reviews tab filter: "relevant" | "latest" | "high"
  const [reviewSort, setReviewSort] = useState("latest");

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] = useState(null);
  const [priceForm, setPriceForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const fetchBusinessDetail = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/listings/${slug}`);
      
      setBusiness(res.data);
    } catch (error) {
      console.log("Business Detail API Error:", error.response?.data || error);
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (listingId) => {
    if (!listingId) return;

    try {

      setReviewsLoading(true);

      const res = await API.get(`/reviews/listing/${listingId}`);

      const reviewList = res.data?.items || res.data?.data || res.data || [];
      setReviews(Array.isArray(reviewList) ? reviewList : []);
    } catch (error) {
      console.log("Reviews API Error:", error.response?.data || error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessDetail();
  }, [slug]);

  useEffect(() => {
    if (business?.id) {
      fetchReviews(business.id);
    }
  }, [business?.id]);

  const handleSubmitReview = async () => {
    if (!selectedRating) {
      alert("Please select rating first");
      return;
    }

    try {
      setSubmitting(true);

      await API.post("/reviews", {
        listingId: business.id,
        rating: selectedRating,
        comment: reviewText,
      });

      setSelectedRating(0);
      setHoverRating(0);
      setReviewText("");

      await fetchReviews(business.id);

      alert("Review submitted successfully");
    } catch (error) {
      console.log("Submit Review Error:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Failed to submit review. Please login or try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToReviews = () => {
    document
      .getElementById("reviews-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const openPriceModal = (item) => {
    setSelectedCatalogue(item);
    setPriceForm({
      name: "",
      email: "",
      phone: "",
      message: `Hi, I want to know the price for ${item.title}.`,
    });
    setShowPriceModal(true);
  };

  const closePriceModal = () => {
    setShowPriceModal(false);
    setSelectedCatalogue(null);
  };

  const handlePriceFormChange = (e) => {
    setPriceForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAskForPrice = async (e) => {
    e.preventDefault();

    if (!priceForm.name || !priceForm.phone) {
      alert("Please enter your name and phone number");
      return;
    }
    try {
      await API.post("/messages", {
        listingId: business?.id,
        listingName: business?.name,
        serviceTitle: selectedCatalogue?.title,
        name: priceForm.name,
        email: priceForm.email,
        phone: priceForm.phone,
        message: priceForm.message,
      });
      alert("Your enquiry has been sent! The business owner will contact you soon.");
    } catch (error) {
      console.log("Ask For Price Error:", error.response?.data || error);
      alert("Enquiry sent (backend integration pending).");
    }
    closePriceModal();
  };

  const averageRating = useMemo(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce(
        (sum, review) => sum + Number(review.rating || 0),
        0
      );

      return (total / reviews.length).toFixed(1);
    }

    return business?.rating || "0.0";
  }, [reviews, business?.rating]);

  const totalReviews = reviews.length || business?.reviewCount || 0;

  // Rating distribution: count per star 5→1
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.round(Number(r.rating));
      if (star >= 1 && star <= 5) dist[star]++;
    });
    return dist;
  }, [reviews]);

  // Recent rating trend: last 6 reviews
  const recentRatingTrend = useMemo(() => {
    return [...reviews]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6)
      .map((r) => Number(r.rating || 0));
  }, [reviews]);

  // Review highlights: extract keywords from comments
  const reviewHighlights = useMemo(() => {
    const keywords = [
      "clean", "professional", "friendly", "fast", "good", "excellent",
      "hygienic", "affordable", "experienced", "quality", "best",
    ];
    const counts = {};
    reviews.forEach((r) => {
      const comment = (r.comment || "").toLowerCase();
      keywords.forEach((kw) => {
        if (comment.includes(kw)) {
          counts[kw] = (counts[kw] || 0) + 1;
        }
      });
    });
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        label: word.charAt(0).toUpperCase() + word.slice(1),
        count,
      }));
  }, [reviews]);

  // Sorted reviews
  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (reviewSort === "latest") {
      return list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }
    if (reviewSort === "high") {
      return list.sort((a, b) => Number(b.rating) - Number(a.rating));
    }
    // "relevant" = highest rating first, then latest
    return list.sort((a, b) => {
      if (Number(b.rating) !== Number(a.rating))
        return Number(b.rating) - Number(a.rating);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [reviews, reviewSort]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading business details...
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Business not found.
      </div>
    );
  }

  const mainImage =
    business.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200";

  const phone = business.contactPhone || business.whatsappPhone || "";

  const fullAddress =
    [
      business.addressLine1,
      business.addressLine2,
      business.city?.name,
      "India",
    ]
      .filter(Boolean)
      .join(", ") || "";

  const hasCoordinates =
    business.latitude !== undefined &&
    business.latitude !== null &&
    business.longitude !== undefined &&
    business.longitude !== null;

  const mapDestination = hasCoordinates
    ? `${business.latitude},${business.longitude}`
    : fullAddress;

  const mapUrl = mapDestination
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapDestination)}&output=embed`
    : "";

  const directionsUrl = mapDestination
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapDestination)}&travelmode=driving`
    : null;

  const isOpen = Boolean(business.opensAt && business.closesAt);

  const categoryName = business.category?.name?.toLowerCase() || "";

  const commonCatalogue = [
    { title: "Price Details", description: "Ask about pricing, packages and service charges." },
    { title: "Availability", description: "Check availability, timings and appointment slots." },
    { title: "Booking / Appointment", description: "Ask for booking, reservation or appointment details." },
    { title: "Offers & Discounts", description: "Ask about current offers, discounts and deals." },
  ];

  const salonCatalogue = [
    { title: "Hair Styling", description: "Ask about hair styling services, price and duration." },
    { title: "Hair Cut", description: "Ask for haircut price, available styles and timing." },
    { title: "Facial / Cleanup", description: "Ask about facial, cleanup and beauty treatment prices." },
    { title: "Bridal / Party Makeup", description: "Ask for bridal, party makeup and package details." },
  ];

  const cafeCatalogue = [
    { title: "Menu Price", description: "Ask for menu, food pricing and popular items." },
    { title: "Table Booking", description: "Ask for table availability and reservation details." },
    { title: "Party Order", description: "Ask for birthday, party or bulk order pricing." },
    { title: "Offers", description: "Ask about current cafe offers and discounts." },
  ];

  const catalogueItems =
    categoryName.includes("salon") || categoryName.includes("beauty") || categoryName.includes("spa")
      ? salonCatalogue
      : categoryName.includes("cafe") || categoryName.includes("restaurant") || categoryName.includes("food")
      ? cafeCatalogue
      : commonCatalogue;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image */}
      <div className="w-full h-[300px] md:h-[420px]">
        <img
          src={mainImage}
          alt={business.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* Left / Main Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm mb-4">
            {business.category?.name || "Business"}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {business.name}
          </h1>


          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-green-600 text-white px-3 py-1 rounded-md font-bold flex items-center gap-1">
                {averageRating} <FaStar className="text-xs" />
              </span>

              <button
                type="button"
                onClick={scrollToReviews}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                {totalReviews} ratings
              </button>

              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <FaCheckCircle />
                Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-gray-700">
              <span>{business.city?.name || "Rohini, Delhi"}</span>
              <span>•</span>
              {business.distanceKm ? (
                <span className="flex items-center gap-1">
                  <FaCar />
                  {business.distanceKm} km
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-500">
                  <FaCar />
                  Distance not available
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-gray-700">
              <span>{business.category?.name || "Business"}</span>
              <span>•</span>
              <span>{business.yearsInBusiness || 0} Years in Business</span>
            </div>

            <div className={`font-semibold ${isOpen ? "text-green-600" : "text-gray-600"}`}>
              {isOpen ? "Open Now" : "Timing not available"}
              {business.closesAt && (
                <span className="text-gray-700 font-normal"> : until {business.closesAt}</span>
              )}
            </div>
          </div>

          <p className="text-gray-600 mt-6 leading-7">
            {business.description || "No description available."}
          </p>

          {/* Catalogue */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Catalogue</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {catalogueItems.map((item) => (
              <div
                key={item.title}
                className="border rounded-2xl p-5 bg-white hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                <button
                  type="button"
                  className="text-blue-600 font-semibold mt-3 hover:underline"
                  onClick={() => alert(item.description)}
                >
                  View More
                </button>

                <button
                  type="button"
                  onClick={() => openPriceModal(item)}
                  className="mt-5 w-full border border-blue-600 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
                >
                  Ask for Price
                </button>
              </div>
            ))}
          </div>

          {/* Location */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Location</h2>

          {mapUrl ? (
            <div className="overflow-hidden rounded-2xl border h-[350px]">
              <iframe
                title="Business Location"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-2xl border h-[350px] flex items-center justify-center text-gray-500">
              Location not available
            </div>
          )}

          {/* Gallery */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Gallery</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {(business.images?.length ? business.images : [{ url: mainImage }]).map(
              (img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt="Gallery"
                  className="h-40 w-full object-cover rounded-xl"
                />
              )
            )}
          </div>

          {/* ───── REVIEWS & RATINGS SECTION ───── */}
          <div id="reviews-section" className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

            {/* Rating Summary Card */}
            <div className="border rounded-2xl p-6 bg-white shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">

                {/* Big Rating Badge */}
                <div className="flex-shrink-0 bg-green-700 text-white rounded-2xl px-6 py-5 flex flex-col items-center min-w-[110px]">
                  <span className="text-4xl font-extrabold leading-none">{averageRating}</span>
                  <div className="flex gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar
                        key={s}
                        className={`text-sm ${
                          s <= Math.round(Number(averageRating))
                            ? "text-yellow-300"
                            : "text-green-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-green-200 mt-1">{totalReviews} ratings</span>
                </div>

                {/* Star Breakdown Bars */}
                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingDistribution[star] || 0;
                    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700 w-4">{star}</span>
                        <FaStar className="text-yellow-400 text-sm flex-shrink-0" />
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-2.5 rounded-full bg-green-600 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rating described */}
              <p className="text-sm text-gray-500 mt-4 border-t pt-4">
                Based on <strong>{totalReviews}</strong> verified ratings for{" "}
                <strong>{business.name}</strong>
              </p>
            </div>

            {/* Recent Rating Trend */}
            {recentRatingTrend.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-800 mb-3">Recent Rating Trend</h3>
                <div className="flex flex-wrap gap-2">
                  {recentRatingTrend.map((rating, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700 bg-white"
                    >
                      {rating.toFixed(1)}
                      <FaStar className="text-yellow-400 text-xs" />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* User Reviews Header + Sort */}
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-800 mb-3">User Reviews</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "relevant", label: "Relevant" },
                  { key: "latest", label: "Latest" },
                  { key: "high", label: "High to Low" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setReviewSort(key)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                      reviewSort === key
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Highlights */}
            {reviewHighlights.length > 0 && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-gray-800 mb-3">Review Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {reviewHighlights.map(({ label, count }) => (
                    <span
                      key={label}
                      className="bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-full px-4 py-1.5"
                    >
                      {label} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Write a Review */}
            <div className="bg-gray-50 border rounded-2xl p-5 mb-6">
              <p className="font-semibold mb-3">Rate this Business</p>
              <div className="flex gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={
                      star <= (hoverRating || selectedRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                className="w-full border rounded-xl p-3 mt-4 outline-none focus:border-blue-500"
                rows="3"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={submitting}
                className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>

            {/* Reviews List */}
            {reviewsLoading ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : sortedReviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FaRegStar className="text-5xl mx-auto mb-3 text-gray-200" />
                <p>No reviews yet. Be the first to review this business.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedReviews.map((review) => (
                  <div key={review.id} className="border rounded-2xl p-5 bg-white hover:shadow-sm transition">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <FaUserCircle className="text-2xl" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">
                            {review.user?.name || review.name || "User"}
                          </h4>
                          <span className="bg-green-600 text-white px-2 py-0.5 rounded-md text-sm font-bold flex items-center gap-1">
                            {review.rating} <FaStar className="text-xs" />
                          </span>
                        </div>

                        {/* Star visual row */}
                        <div className="flex gap-0.5 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FaStar
                              key={s}
                              className={`text-sm ${
                                s <= Number(review.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.comment || "No comment added."}
                        </p>

                        {review.createdAt && (
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* ───── END REVIEWS SECTION ───── */}
        </div>

        {/* Right Sidebar */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-5">Business Info</h2>

          <div className="space-y-4 text-gray-700">
            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600" />
              {fullAddress || "Location not available"}
            </p>

            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-green-600" />
              {phone || "Phone not available"}
            </p>

            <p className="flex items-center gap-3">
              <FaEnvelope className="text-red-500" />
              {business.email || "Email not available"}
            </p>

            <p className="flex items-center gap-3">
              <FaClock className="text-orange-500" />
              {business.opensAt && business.closesAt
                ? `${business.opensAt} - ${business.closesAt}`
                : "Timing not available"}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <a
              href={`tel:${phone}`}
              className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Call Now
            </a>

            {directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                <FaDirections />
                Get Directions
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-3 bg-gray-400 text-white py-3 rounded-xl font-semibold cursor-not-allowed w-full"
              >
                <FaDirections />
                Location not available
              </button>
            )}

            <button
              type="button"
              onClick={scrollToReviews}
              className="flex items-center justify-center gap-3 border border-yellow-400 text-yellow-600 py-3 rounded-xl font-semibold hover:bg-yellow-50 transition w-full"
            >
              <FaRegStar />
              Rate & Review
            </button>

            <a
              href="https://www.instagram.com/oyerohini_?igsh=MXFlbzRvbndndmJ5Zw%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border py-3 rounded-xl font-semibold hover:bg-pink-50 transition"
            >
              <FaInstagram className="text-pink-500 text-xl" />
              Instagram
            </a>

            {business.websiteUrl && (
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 border py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                <FaGlobe className="text-blue-600 text-xl" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Ask for Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              type="button"
              onClick={closePriceModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold">Ask for Price</h2>

            <p className="text-gray-600 mt-2">
              {selectedCatalogue?.title} - {business.name}
            </p>

            <form onSubmit={handleAskForPrice} className="mt-5 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={priceForm.name}
                onChange={handlePriceFormChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={priceForm.email}
                onChange={handlePriceFormChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number *"
                value={priceForm.phone}
                onChange={handlePriceFormChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                required
              />

              <textarea
                name="message"
                rows="4"
                placeholder="Your message"
                value={priceForm.message}
                onChange={handlePriceFormChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
