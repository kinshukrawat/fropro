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
} from "react-icons/fa";

import API from "../api/api";

export default function ViewDetail() {
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const fetchBusinessDetail = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/listings/${slug}`);

      console.log("Listing API Response:", res.data);
      console.log("API addressLine1:", res.data?.addressLine1);
      console.log("API latitude:", res.data?.latitude);
      console.log("API longitude:", res.data?.longitude);

      setBusiness(res.data);
    } catch (error) {
      console.log("Business Detail API Error:", error);
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessDetail();
  }, [slug]);

  const handleSubmitReview = () => {
    if (!selectedRating) {
      alert("Please select rating first");
      return;
    }

    alert("Review feature backend integration next step me add karenge");
    setSelectedRating(0);
    setReviewText("");
  };

  const scrollToReviews = () => {
    document
      .getElementById("reviews-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

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

  const directionsDestination = hasCoordinates
    ? `${business.latitude},${business.longitude}`
    : fullAddress;

  const directionsUrl = directionsDestination
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        directionsDestination
      )}&travelmode=driving`
    : null;

  const isOpen = Boolean(business.opensAt && business.closesAt);

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

          {/* Justdial style details */}
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-green-600 text-white px-3 py-1 rounded-md font-bold flex items-center gap-1">
                {business.rating || "4.4"} <FaStar className="text-xs" />
              </span>

              <button
                type="button"
                onClick={scrollToReviews}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                {business.reviewCount || 333} ratings
              </button>

              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <FaCheckCircle />
                Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-gray-700">
              <span>{business.city?.name || "Rohini, Delhi"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FaCar />
                {business.distanceKm || "2.6"} km
              </span>
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
                    className={
                      star <= selectedRating
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
                className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700"
              >
                Submit Review
              </button>
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
    </div>
  );
}
