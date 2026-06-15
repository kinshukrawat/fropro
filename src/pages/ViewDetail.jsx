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
    setPriceForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAskForPrice = (e) => {
    e.preventDefault();

    if (!priceForm.name || !priceForm.phone) {
      alert("Please enter your name and phone number");
      return;
    }

    console.log("Ask For Price Frontend Data:", {
      listingId: business?.id,
      listingName: business?.name,
      serviceTitle: selectedCatalogue?.title,
      ...priceForm,
    });

    alert("Your enquiry is ready. Backend integration next step me add karenge.");
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
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        mapDestination
      )}&output=embed`
    : "";

  const directionsUrl = mapDestination
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        mapDestination
      )}&travelmode=driving`
    : null;

  const isOpen = Boolean(business.opensAt && business.closesAt);

  const categoryName = business.category?.name?.toLowerCase() || "";

  const commonCatalogue = [
    {
      title: "Price Details",
      description: "Ask about pricing, packages and service charges.",
    },
    {
      title: "Availability",
      description: "Check availability, timings and appointment slots.",
    },
    {
      title: "Booking / Appointment",
      description: "Ask for booking, reservation or appointment details.",
    },
    {
      title: "Offers & Discounts",
      description: "Ask about current offers, discounts and deals.",
    },
  ];

  const salonCatalogue = [
    {
      title: "Hair Styling",
      description: "Ask about hair styling services, price and duration.",
    },
    {
      title: "Hair Cut",
      description: "Ask for haircut price, available styles and timing.",
    },
    {
      title: "Facial / Cleanup",
      description: "Ask about facial, cleanup and beauty treatment prices.",
    },
    {
      title: "Bridal / Party Makeup",
      description: "Ask for bridal, party makeup and package details.",
    },
  ];

  const cafeCatalogue = [
    {
      title: "Menu Price",
      description: "Ask for menu, food pricing and popular items.",
    },
    {
      title: "Table Booking",
      description: "Ask for table availability and reservation details.",
    },
    {
      title: "Party Order",
      description: "Ask for birthday, party or bulk order pricing.",
    },
    {
      title: "Offers",
      description: "Ask about current cafe offers and discounts.",
    },
  ];

  const catalogueItems =
    categoryName.includes("salon") ||
    categoryName.includes("beauty") ||
    categoryName.includes("spa")
      ? salonCatalogue
      : categoryName.includes("cafe") ||
        categoryName.includes("restaurant") ||
        categoryName.includes("food")
      ? cafeCatalogue
      : commonCatalogue;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full h-[300px] md:h-[420px]">
        <img
          src={mainImage}
          alt={business.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
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

            <div
              className={`font-semibold ${
                isOpen ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isOpen ? "Open Now" : "Timing not available"}
              {business.closesAt && (
                <span className="text-gray-700 font-normal">
                  {" "}
                  : until {business.closesAt}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 mt-6 leading-7">
            {business.description || "No description available."}
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Catalogue</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {catalogueItems.map((item) => (
              <div
                key={item.title}
                className="border rounded-2xl p-5 bg-white hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-2 line-clamp-2">
                  {item.description}
                </p>

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

          <h2 className="text-2xl font-bold mt-8 mb-4">Gallery</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {(business.images?.length
              ? business.images
              : [{ url: mainImage }]
            ).map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt="Gallery"
                className="h-40 w-full object-cover rounded-xl"
              />
            ))}
          </div>

          <div id="reviews-section" className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Rate this Business</h2>

            <div className="bg-gray-50 border rounded-2xl p-5">
              <p className="font-semibold mb-3">Tap to rate</p>

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


              <div className="mt-8">
                <h3 className="text-xl font-bold mb-3">Recent Reviews</h3>

                {reviewsLoading ? (
                  <p className="text-gray-500">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-500">
                    No reviews yet. Be the first to review this business.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {[...reviews]
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt || 0) -
                          new Date(a.createdAt || 0)
                      )
                      .map((review) => (
                        <div
                          key={review.id}
                          className="border rounded-2xl p-5 bg-white"
                        >
                          <div className="flex items-start gap-3">
                            <FaUserCircle className="text-3xl text-gray-400" />

                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold">
                                  {review.user?.name || review.name || "User"}
                                </h4>

                                <span className="bg-green-600 text-white px-2 py-1 rounded-md text-sm font-bold">
                                  {review.rating} ★
                                </span>
                              </div>

                              <p className="text-gray-700 mt-2">
                                {review.comment || "No comment added."}
                              </p>

                              {review.createdAt && (
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-IN", {
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
            </div>
          </div>
        </div>

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
