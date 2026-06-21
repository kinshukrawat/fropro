import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MapSection from "../components/MapSection";
import ReviewSection, { formatListingRating } from "../components/ReviewSection";
import { getListingBySlug } from "../api/api";

import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaGlobe,
  FaHeart,
  FaShareAlt,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const fallbackImage =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop";

const catalogueItems = [
  {
    title: "Price Details",
    desc: "Ask about pricing, packages and service charges.",
  },
  {
    title: "Availability",
    desc: "Check availability, timings and appointment slots.",
  },
  {
    title: "Booking / Appointment",
    desc: "Ask for booking, reservation or appointment details.",
  },
  {
    title: "Offers & Discounts",
    desc: "Ask about current offers, discounts and deals.",
  },
];

const getInstagramUrl = (value) => {
  if (!value) return "";

  const cleanValue = value.trim();

  if (cleanValue.startsWith("http://") || cleanValue.startsWith("https://")) {
    return cleanValue;
  }

  const handle = cleanValue.replace("@", "");
  return `https://www.instagram.com/${handle}`;
};

export default function BusinessDetails() {
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviewSummary, setReviewSummary] = useState({ rating: 0, reviewCount: 0 });

  const reviewSectionRef = useRef(null);

  const scrollToReviews = () => {
    reviewSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const res = await getListingBySlug(slug);
      setBusiness(res.data);
      setReviewSummary({
        rating: res.data?.rating ?? 0,
        reviewCount: res.data?.reviewCount ?? 0,
      });
    } catch (error) {
      console.log("Business Details API Error:", error);
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchBusinessDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-xl">Loading business details...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-600 text-xl">Business not found.</p>
      </div>
    );
  }

  const image = business.images?.[0]?.url || business.image || fallbackImage;

  const gallery =
    business.images?.length > 0
      ? business.images.map((img) => img.url)
      : [image];

  const category = business.category?.name || business.category || "Business";
  const ratingLabel = formatListingRating(
    reviewSummary.rating,
    reviewSummary.reviewCount
  );
  const reviewCountLabel = reviewSummary.reviewCount || 0;

  const fullAddress =
    business.address ||
    [business.addressLine1, business.addressLine2, business.city?.name]
      .filter(Boolean)
      .join(", ") ||
    "Location not available";

  const shortLocation =
    business.city?.name ||
    business.addressLine2 ||
    business.addressLine1 ||
    "Location";

  const phone = business.contactPhone || business.phone || "";
  const website = business.website || "";
  const instagramUrl = business.instagramUrl || "";

  const whatsappPhone =
    business.whatsappPhone || business.contactPhone || business.phone || "";

  const whatsappLink = whatsappPhone
    ? `https://wa.me/91${whatsappPhone.replace(/\D/g, "").slice(-10)}`
    : "#";

  const timing =
    business.opensAt && business.closesAt
      ? `${business.opensAt} - ${business.closesAt}`
      : "Timing not available";

  const description =
    business.description || "No description available for this business.";

  const websiteUrl = website?.startsWith("http")
    ? website
    : `https://${website}`;

  const hasCoordinates =
    business.latitude !== undefined &&
    business.latitude !== null &&
    business.longitude !== undefined &&
    business.longitude !== null;

  const mapDestination = hasCoordinates
    ? `${business.latitude},${business.longitude}`
    : fullAddress;

  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(
    mapDestination
  )}`;

  const isOpen = business.opensAt && business.closesAt;

  const handleShare = async () => {
    const shareData = {
      title: business.name,
      text: `Check out ${business.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative w-full h-[450px] overflow-hidden">
        <img
          src={image}
          alt={business.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 text-white">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="bg-blue-600 px-4 py-2 rounded-full w-fit mb-4 font-medium">
                {category}
              </p>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {business.name}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-lg">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-2" />
                  {ratingLabel}
                  {reviewCountLabel > 0 && ` (${reviewCountLabel} Reviews)`}
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  {shortLocation}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="bg-white text-black px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition">
                <FaHeart />
                Save
              </button>

              <button
                onClick={handleShare}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition"
              >
                <FaShareAlt />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-green-600 font-semibold text-sm flex items-center gap-1">
                  ✔ Verified
                </span>

                {isOpen && (
                  <span className="text-green-500 text-sm font-medium">
                    Open Now · until {business.closesAt}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-3">About Business</h2>

              <p className="text-gray-600 leading-8 mb-6">{description}</p>

              <div className="border border-gray-200 rounded-2xl p-6 mt-6">
                <h3 className="text-2xl font-bold mb-5">Business Info</h3>

                <div className="space-y-4 text-gray-700">
                  <p className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-blue-600" />
                    {fullAddress}
                  </p>

                  <p className="flex items-center gap-3">
                    <FaPhoneAlt className="text-green-600" />
                    {phone || "Phone not available"}
                  </p>

                  <p className="flex items-center gap-3">
                    <FaClock className="text-orange-500" />
                    {timing}
                  </p>

                  {website && (
                    <p className="flex items-center gap-3">
                      <FaGlobe className="text-blue-500" />
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {website}
                      </a>
                    </p>
                  )}
                </div>

                <div className="space-y-3 mt-6">
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-semibold transition"
                    >
                      Call Now
                    </a>
                  )}

                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-semibold transition"
                  >
                    Get Directions
                  </a>

                  <button
                    onClick={scrollToReviews}
                    className="w-full border border-yellow-500 text-yellow-600 py-3 rounded-xl font-semibold hover:bg-yellow-50 transition"
                  >
                    Rate & Review
                  </button>

                  {instagramUrl && (
                    <a
                      href={getInstagramUrl(instagramUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-pink-50 transition flex items-center justify-center gap-2"
                    >
                      <FaInstagram className="text-pink-600 text-xl" />
                      Instagram
                    </a>
                  )}

                  {whatsappPhone && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2"
                    >
                      <FaWhatsapp className="text-green-500 text-xl" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${business.name} ${index + 1}`}
                    onClick={() => setSelectedImage(img)}
                    className="rounded-2xl h-40 object-cover w-full hover:scale-105 transition duration-300 cursor-pointer"
                  />
                ))}
              </div>
            </div>

            <ReviewSection
              listingId={business.id}
              businessName={business.name}
              summaryRating={reviewSummary.rating}
              summaryReviewCount={reviewSummary.reviewCount}
              sectionRef={reviewSectionRef}
              onSummaryUpdate={setReviewSummary}
            />

            <div className="bg-white rounded-3xl shadow p-4">
              <MapSection
                address={fullAddress}
                latitude={business.latitude}
                longitude={business.longitude}
              />
            </div>
          </div>

          <div className="sticky top-24">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-2xl font-bold mb-5">Catalogue</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catalogueItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-300 rounded-xl p-4 min-h-[180px] hover:shadow-md transition"
                  >
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>

                    <p className="text-gray-500 text-sm leading-6 mb-3">
                      {item.desc}
                    </p>

                    <button className="text-blue-600 font-semibold text-sm mb-4 hover:underline">
                      View More
                    </button>

                    <button className="w-full border border-blue-500 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
                      Ask for Price
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-6 text-white text-5xl font-bold"
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] rounded-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}


