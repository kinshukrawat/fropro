import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900">
            Contact Us
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Have questions? We would love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div className="bg-white rounded-2xl shadow p-8">

            <h2 className="text-2xl font-bold mb-8">
              Get In Touch
            </h2>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <FaPhoneAlt className="text-blue-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Phone Number
                  </h3>

                  <p className="text-gray-500">
                    +91 84488 66017
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <FaWhatsapp className="text-green-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    WhatsApp
                  </h3>

                  <p className="text-gray-500">
                    +91 84488 66017
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-4 rounded-xl">
                  <FaEnvelope className="text-red-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Email Address
                  </h3>

                  <p className="text-gray-500">
                    Keyproductionofficial@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-4 rounded-xl">
                  <FaMapMarkerAlt className="text-yellow-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Office Address
                  </h3>

                  <p className="text-gray-500">
                    
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-2xl shadow p-8">

            <h2 className="text-2xl font-bold mb-8">
              Send Message
            </h2>

            <form className="space-y-5">

              <div>
                <label className="block font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}