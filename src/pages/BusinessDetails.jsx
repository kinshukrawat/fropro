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
} from "react-icons/fa";

const fallbackImage =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop";

export default function BusinessDetails() {
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (slug) {
      fetchBusinessDetails();
    }
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

  const image =
    business.images?.[0]?.url ||
    business.image ||
    fallbackImage;

  const gallery =
    business.images?.length > 0
      ? business.images.map((img) => img.url)
      : [
          image,
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
        ];

  const category = business.category?.name || business.category || "Business";
  const rating = business.rating || "4.5";
  const reviews = business.reviews || business.reviewCount || 0;
  const location =
    business.city?.name ||
    business.addressLine1 ||
    business.address ||
    "Location not available";

  const phone = business.contactPhone || business.phone || "";
  const website = business.website || "";
  const timing = business.timing || business.openingHours || "Timing not available";
  const description =
    business.description || "No description available for this business.";

  const websiteUrl = website?.startsWith("http")
    ? website
    : `https://${website}`;

  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(location)}`;

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

              <h1 className="text-5xl font-bold mb-4">{business.name}</h1>

              <div className="flex flex-wrap items-center gap-5 text-lg">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-2" />
                  {rating} ({reviews} Reviews)
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  {location}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="bg-white text-black px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition">
                <FaHeart />
                Save
              </button>

              <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition">
                <FaShareAlt />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">About Business</h2>

              <p className="text-gray-600 leading-8 mb-8">{description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FaMapMarkerAlt className="text-blue-600 mr-3 text-xl" />
                    <h3 className="font-bold text-lg">Address</h3>
                  </div>
                  <p className="text-gray-600">{location}</p>
                </div>

                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FaClock className="text-blue-600 mr-3 text-xl" />
                    <h3 className="font-bold text-lg">Opening Hours</h3>
                  </div>
                  <p className="text-gray-600">{timing}</p>
                </div>

                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FaGlobe className="text-blue-600 mr-3 text-xl" />
                    <h3 className="font-bold text-lg">Website</h3>
                  </div>

                  {website ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {website}
                    </a>
                  ) : (
                    <p className="text-gray-600">Website not available</p>
                  )}
                </div>

                <div className="bg-gray-100 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <FaPhoneAlt className="text-blue-600 mr-3 text-xl" />
                    <h3 className="font-bold text-lg">Phone Number</h3>
                  </div>
                  <p className="text-gray-600">{phone || "Phone not available"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">Gallery</h2>

              <div className="grid md:grid-cols-3 gap-5">
                {gallery.slice(0, 3).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={business.name}
                    className="rounded-2xl h-56 object-cover w-full hover:scale-105 transition duration-300"
                  />
                ))}
              </div>
            </div>

            <MapSection />
          </div>

          <div>
            <div className="bg-white rounded-3xl shadow p-8 sticky top-24">
              <h2 className="text-3xl font-bold mb-6">Contact Business</h2>

              <div className="space-y-4 mb-8">
                <a
                  href={`tel:${phone}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
                >
                  <FaPhoneAlt />
                  Call Now
                </a>

                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
                >
                  <FaDirections />
                  Get Directions
                </a>
              </div>

              <div className="space-y-6">
                <div className="border-b pb-4">
                  <p className="font-semibold text-black mb-2">Phone Number</p>
                  <p className="text-gray-600">{phone || "Phone not available"}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="font-semibold text-black mb-2">Address</p>
                  <p className="text-gray-600">{location}</p>
                </div>

                <div className="border-b pb-4">
                  <p className="font-semibold text-black mb-2">Working Hours</p>
                  <p className="text-gray-600">{timing}</p>
                </div>

                <div>
                  <p className="font-semibold text-black mb-2">Website</p>

                  {website ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {website}
                    </a>
                  ) : (
                    <p className="text-gray-600">Website not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
