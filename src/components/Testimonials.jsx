import { FaStar, FaUserCircle } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Business Owner",
    review:
      "This platform helped me get more local customers for my salon business.",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Verma",
    role: "Customer",
    review:
      "Very easy to find nearby cafes and gyms. The UI is clean and fast.",
    rating: 5,
  },
  {
    id: 3,
    name: "Aman Gupta",
    role: "Restaurant Owner",
    review:
      "I received many leads after listing my restaurant here.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            What People Say
          </h2>

          <p className="text-gray-500 mt-3">
            Trusted by customers and business owners.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4 mb-5">
                <FaUserCircle className="text-5xl text-gray-400" />

                <div>
                  <h3 className="text-xl font-bold">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {item.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(item.rating)].map((_, index) => (
                  <FaStar key={index} />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed">
                "{item.review}"
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}