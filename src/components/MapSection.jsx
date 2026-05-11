import {
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

import {
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
  FaDirections,
} from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "24px",
};

const center = {
  lat: 28.7041,
  lng: 77.1025,
};

export default function MapSection() {
  return (
    <section className="bg-white rounded-[32px] shadow-xl overflow-hidden">
      {/* TOP HEADER */}
      <div className="p-8 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* LEFT */}
          <div>
            <p className="text-blue-600 font-semibold mb-2">
              Location & Directions
            </p>

            <h2 className="text-4xl font-bold mb-3">
              Business Location
            </h2>

            <p className="text-gray-500 max-w-2xl leading-7">
              Easily locate the business on Google Maps and
              get directions instantly from your current
              location.
            </p>
          </div>

          {/* RIGHT BUTTON */}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 w-fit"
          >
            <FaDirections />
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* GOOGLE MAP */}
      <div className="p-6">
        <LoadScript
          googleMapsApiKey={
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          }
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            options={{
              fullscreenControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: true,
            }}
          >
            {/* MARKER */}
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* BOTTOM INFO CARDS */}
      <div className="grid md:grid-cols-3 gap-6 p-8 pt-2">
        {/* ADDRESS */}
        <div className="bg-gray-100 rounded-3xl p-6 hover:shadow-lg transition">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
          </div>

          <h3 className="text-xl font-bold mb-3">
            Address
          </h3>

          <p className="text-gray-600 leading-7">
            Sector 10, Rohini, Delhi, India
          </p>
        </div>

        {/* HOURS */}
        <div className="bg-gray-100 rounded-3xl p-6 hover:shadow-lg transition">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
            <FaClock className="text-green-600 text-2xl" />
          </div>

          <h3 className="text-xl font-bold mb-3">
            Opening Hours
          </h3>

          <p className="text-gray-600 leading-7">
            Monday - Sunday
            <br />
            10:00 AM - 9:00 PM
          </p>
        </div>

        {/* CONTACT */}
        <div className="bg-gray-100 rounded-3xl p-6 hover:shadow-lg transition">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-5">
            <FaPhoneAlt className="text-purple-600 text-2xl" />
          </div>

          <h3 className="text-xl font-bold mb-3">
            Contact Number
          </h3>

          <p className="text-gray-600 leading-7">
            +91 9876543210
          </p>

          <a
            href="tel:+919876543210"
            className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
          >
            Call Business
          </a>
        </div>
      </div>
    </section>
  );
}