import { FaStar, FaUserCircle } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    business: "Urban Salon",
    rating: 5,
    comment: "Very good service and clean salon. Staff was polite.",
    date: "10 May 2026",
  },
  {
    id: 2,
    name: "Priya Verma",
    business: "Fit Gym Club",
    rating: 4,
    comment: "Nice gym equipment and good trainer support.",
    date: "8 May 2026",
  },
  {
    id: 3,
    name: "Aman Gupta",
    business: "Coffee House",
    rating: 5,
    comment: "Best cafe near my area. Coffee taste was amazing.",
    date: "6 May 2026",
  },
];

export default function Reviews() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Reviews & Ratings
          </h1>
          <p className="text-gray-500 mt-3">
            See what customers are saying about local businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaUserCircle className="text-5xl text-gray-400" />

                <div>
                  <h3 className="text-xl font-bold">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.business}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-5">
                “{review.comment}”
              </p>

              <p className="text-sm text-gray-400">
                {review.date}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}