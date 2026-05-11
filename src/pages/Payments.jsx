import { FaCheckCircle, FaCreditCard, FaRupeeSign } from "react-icons/fa";

const plans = [
  {
    id: 1,
    name: "Basic",
    price: "999",
    duration: "per month",
    features: ["Business Listing", "Basic Support", "Contact Details", "Category Listing"],
  },
  {
    id: 2,
    name: "Premium",
    price: "1999",
    duration: "per month",
    features: ["Featured Listing", "Priority Support", "Gallery Images", "More Leads"],
  },
  {
    id: 3,
    name: "Pro",
    price: "4999",
    duration: "per month",
    features: ["Top Placement", "Verified Badge", "Analytics", "Unlimited Leads"],
  },
];

export default function Payments() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Payments & Subscription Plans
          </h1>
          <p className="text-gray-500 mt-3">
            Choose the best plan to grow your business listing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>

              <div className="flex items-center mb-6">
                <FaRupeeSign className="text-3xl text-blue-600" />
                <span className="text-5xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-500 ml-2">{plan.duration}</span>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow p-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FaCreditCard className="text-3xl text-blue-600" />
            <h2 className="text-2xl font-bold">Payment Details</h2>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block font-medium mb-2">Business Name</label>
              <input
                type="text"
                placeholder="Enter business name"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Owner Name</label>
              <input
                type="text"
                placeholder="Enter owner name"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Select Payment Method</label>
              <select className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
                <option>Razorpay</option>
                <option>UPI</option>
                <option>Debit / Credit Card</option>
                <option>Net Banking</option>
              </select>
            </div>

            <button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Pay Now
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}