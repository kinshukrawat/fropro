import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { getRecentReviews } from "../api/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await getRecentReviews(24);
        const data = res.data?.items || res.data?.data || res.data || [];
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Recent Reviews API Error:", error.response?.data || error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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

        {loading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">
            No reviews yet. Be the first to review a business from its detail
            page.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <FaUserCircle className="text-5xl text-gray-400" />

                  <div>
                    <h3 className="text-xl font-bold">
                      {review.name || "Guest"}
                    </h3>
                    {review.listing?.name && (
                      <Link
                        to={`/business/detail/${review.listing.slug}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {review.listing.name}
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={
                        index < Number(review.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-600 mb-5">
                  “{review.comment || "No comment added."}”
                </p>

                <p className="text-sm text-gray-400">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
