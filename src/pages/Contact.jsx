import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import API from "../api/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/contact", form);
      

      alert("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.log("Contact Form Error:", error);
      alert("Contact API backend me abhi available nahi hai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-500 mt-3 text-lg">
            Have questions? We would love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">


          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-8">Get In Touch</h2>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <FaPhoneAlt className="text-blue-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Phone Number</h3>
                  <p className="text-gray-500">+91 84488 66017</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <FaWhatsapp className="text-green-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">WhatsApp</h3>
                  <p className="text-gray-500">+91 84488 66017</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-4 rounded-xl">
                  <FaEnvelope className="text-red-600 text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Email Address</h3>
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
                  <h3 className="font-semibold text-lg">Office Address</h3>
                  <p className="text-gray-500">Rohini, Delhi</p>
                </div>
              </div>

            </div>
          </div>


          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-8">Send Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <textarea
                rows="5"
                name="message"
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}