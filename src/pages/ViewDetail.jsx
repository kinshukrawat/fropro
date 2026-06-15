import React, { useEffect, useState } from "react";
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
} from "react-icons/fa";

import API from "../api/api";

export default function ViewDetail() {
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

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

  console.log("Final fullAddress:", fullAddress);
  console.log("Final mapDestination:", mapDestination);
  console.log("Final directionsDestination:", directionsDestination);

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

          <div className="flex items-center gap-2 mt-3 text-yellow-500">
            <FaStar />
            <span className="font-semibold">{business.rating || "4.5"}</span>
            <span className="text-gray-500">
              ({business.reviewCount || 0} Reviews)
            </span>
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
