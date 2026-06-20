import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { FaDirections } from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "24px",
};

const defaultCenter = {
  lat: 28.7041,
  lng: 77.1025,
};

export default function MapSection({ address = "", latitude, longitude }) {
  const lat = latitude ? Number(latitude) : null;
  const lng = longitude ? Number(longitude) : null;

  const center =
    lat && lng
      ? {
          lat,
          lng,
        }
      : defaultCenter;

  const mapsUrl =
    lat && lng
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          address || "Rohini Delhi"
        )}`;

  return (
    <section className="bg-white rounded-[32px] shadow-xl overflow-hidden">

      <div className="p-8 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <p className="text-blue-600 font-semibold mb-2">
              Location & Directions
            </p>

            <h2 className="text-4xl font-bold mb-3">Business Location</h2>

            <p className="text-gray-500 max-w-2xl leading-7">
              Easily locate this business on Google Maps and get directions
              instantly from your current location.
            </p>
          </div>


          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-4 rounded-2xl font-semibold flex items-center gap-3 w-fit"
          >
            <FaDirections />
            Open in Google Maps
          </a>
        </div>
      </div>


      <div className="p-6">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
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

            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </div>


    </section>
  );
}