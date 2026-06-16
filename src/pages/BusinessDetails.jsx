import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapSection from "../components/MapSection";
import API from "../api/api";

import {
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaDirections,
  FaGlobe,
  FaHeart,
  FaShareAlt,
  FaInstagram,
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

export default function BusinessDetails() {
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/listings/${slug}`);
      setBusiness(res.data);
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
  const rating = business.rating || "4.5";
  const reviews = business.reviews || business.reviewCount || 0;

  const fullAddress =
    business.address ||
    [business.addressLine1, business.addressLine2, business.city?.name]
      .filter(Boolean)
      .join(", ") ||
    "Location not available";

  const phone = business.contactPhone || business.phone || "";
  const website = business.website || "";

  const timing =
    business.opensAt && business.closesAt
      ? `${business.opensAt} - ${business.closesAt}`
      : "Timing not available";

  const description =
    business.description || "No description available for this business.";

  const websiteUrl = website?.startsWith("http")
    ? website
    : `https://${website}`;

  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(
    fullAddress
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
      {/* Hero Banner */}
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
                  {rating} ({reviews} Reviews)
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  {fullAddress}
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

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
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

              <p className="text-gray-600 leading-8 mb-8">{description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-blue-600 mr-3" />
                    <h3 className="font-bold">Address</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{fullAddress}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center mb-2">
                    <FaPhoneAlt className="text-blue-600 mr-3" />
                    <h3 className="font-bold">Phone</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {phone || "Phone not available"}
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center mb-2">
                    <FaClock className="text-blue-600 mr-3" />
                    <h3 className="font-bold">Working Hours</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{timing}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center mb-2">
                    <FaGlobe className="text-blue-600 mr-3" />
                    <h3 className="font-bold">Website</h3>
                  </div>

                  {website ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-sm break-all"
                    >
                      {website}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm">Not available</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition"
                  >
                    <FaPhoneAlt />
                    Call Now
                  </a>
                )}

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition"
                >
                  <FaDirections />
                  Get Directions
                </a>

                <button className="border border-yellow-500 text-yellow-600 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-yellow-50 transition">
                  ☆ Rate & Review
                </button>

                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-gray-50 transition">
                  <FaInstagram />
                  Instagram
                </button>
              </div>
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

            <MapSection />
          </div>

          {/* RIGHT */}
          <div>
            <div className="sticky top-24 space-y-4">
              <h2 className="text-2xl font-bold mb-2">Catalogue</h2>

              {catalogueItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow p-5 border border-gray-100"
                >
                  <h3 className="font-bold text-base mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{item.desc}</p>

                  <button className="w-full border border-blue-500 text-blue-600 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
                    Ask for Price
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
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
