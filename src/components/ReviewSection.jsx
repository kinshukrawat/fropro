import { useEffect, useMemo, useState } from "react";
import { FaRegStar, FaStar, FaUserCircle } from "react-icons/fa";
import {
  getListingReviews,
  getListingReviewSummary,
  submitReview,
} from "../api/api";

export function formatListingRating(rating, reviewCount) {
  if (!reviewCount) return "New";
  const value = Number(rating);
  return Number.isFinite(value) && value > 0 ? value.toFixed(1) : "New";
}

export default function ReviewSection({
  listingId,
  businessName,
  summaryRating = 0,
  summaryReviewCount = 0,
  sectionRef,
  onSummaryUpdate,
}) {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSort, setReviewSort] = useState("latest");
  const [reviewerName, setReviewerName] = useState("");

  const fetchReviews = async () => {
    if (!listingId) return;

    try {
      setReviewsLoading(true);
      const res = await getListingReviews(listingId);
      const reviewList = res.data?.items || res.data?.data || res.data || [];
      setReviews(Array.isArray(reviewList) ? reviewList : []);
    } catch (error) {
      console.log("Reviews API Error:", error.response?.data || error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const averageRating = useMemo(() => {
    if (reviews.length > 0) {
      const total = reviews.reduce(
        (sum, review) => sum + Number(review.rating || 0),
        0
      );
      return (total / reviews.length).toFixed(1);
    }

    return Number(summaryRating || 0).toFixed(1);
  }, [reviews, summaryRating]);

  const totalReviews = reviews.length || summaryReviewCount || 0;

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const star = Math.round(Number(review.rating));
      if (star >= 1 && star <= 5) dist[star]++;
    });
    return dist;
  }, [reviews]);

  const recentRatingTrend = useMemo(() => {
    return [...reviews]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6)
      .map((review) => Number(review.rating || 0));
  }, [reviews]);

  const reviewHighlights = useMemo(() => {
    const keywords = [
      "clean",
      "professional",
      "friendly",
      "fast",
      "good",
      "excellent",
      "hygienic",
      "affordable",
      "experienced",
      "quality",
      "best",
    ];
    const counts = {};

    reviews.forEach((review) => {
      const comment = (review.comment || "").toLowerCase();
      keywords.forEach((keyword) => {
        if (comment.includes(keyword)) {
          counts[keyword] = (counts[keyword] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        label: word.charAt(0).toUpperCase() + word.slice(1),
        count,
      }));
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const list = [...reviews];

    if (reviewSort === "latest") {
      return list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    if (reviewSort === "high") {
      return list.sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    return list.sort((a, b) => {
      if (Number(b.rating) !== Number(a.rating)) {
        return Number(b.rating) - Number(a.rating);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [reviews, reviewSort]);

  const handleSubmitReview = async () => {
    if (!selectedRating) {
      alert("Please select a rating first.");
      return;
    }

    try {
      setSubmitting(true);
      await submitReview({
        listingId,
        rating: selectedRating,
        comment: reviewText,
        ...(reviewerName.trim() ? { name: reviewerName.trim() } : {}),
      });

      setSelectedRating(0);
      setHoverRating(0);
      setReviewText("");
      await fetchReviews();

      const summaryRes = await getListingReviewSummary(listingId);
      onSummaryUpdate?.({
        rating: summaryRes.data?.rating ?? 0,
        reviewCount: summaryRes.data?.reviewCount ?? 0,
      });

      alert("Review submitted successfully.");
    } catch (error) {
      console.log("Submit Review Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="reviews-section"
      ref={sectionRef}
      className="bg-white rounded-3xl shadow p-8 scroll-mt-28"
    >
      <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

      <div className="border rounded-2xl p-6 bg-white shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex-shrink-0 bg-green-700 text-white rounded-2xl px-6 py-5 flex flex-col items-center min-w-[110px]">
            <span className="text-4xl font-extrabold leading-none">
              {averageRating}
            </span>
            <div className="flex gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-sm ${
                    star <= Math.round(Number(averageRating))
                      ? "text-yellow-300"
                      : "text-green-500"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-green-200 mt-1">
              {totalReviews} ratings
            </span>
          </div>

          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star] || 0;
              const pct =
                totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700 w-4">
                    {star}
                  </span>
                  <FaStar className="text-yellow-400 text-sm flex-shrink-0" />
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-green-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4 border-t pt-4">
          Based on <strong>{totalReviews}</strong> verified ratings for{" "}
          <strong>{businessName}</strong>
        </p>
      </div>

      {recentRatingTrend.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-3">
            Recent Rating Trend
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentRatingTrend.map((rating, index) => (
              <span
                key={index}
                className="flex items-center gap-1.5 border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700 bg-white"
              >
                {rating.toFixed(1)}
                <FaStar className="text-yellow-400 text-xs" />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-800 mb-3">User Reviews</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "relevant", label: "Relevant" },
            { key: "latest", label: "Latest" },
            { key: "high", label: "High to Low" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setReviewSort(key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
                reviewSort === key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {reviewHighlights.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-3">
            Review Highlights
          </h3>
          <div className="flex flex-wrap gap-2">
            {reviewHighlights.map(({ label, count }) => (
              <span
                key={label}
                className="bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-full px-4 py-1.5"
              >
                {label} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 border rounded-2xl p-5 mb-6">
        <p className="font-semibold mb-3">Rate this Business</p>

        <input
          type="text"
          placeholder="Your name (optional)"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          className="w-full border rounded-xl p-3 mb-4 outline-none focus:border-blue-500"
        />

        <div className="flex gap-2 text-3xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={
                star <= (hoverRating || selectedRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              <FaStar />
            </button>
          ))}
        </div>

        <textarea
          className="w-full border rounded-xl p-3 mt-4 outline-none focus:border-blue-500 resize-none"
          rows="3"
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <button
          type="button"
          onClick={handleSubmitReview}
          disabled={submitting}
          className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {reviewsLoading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : sortedReviews.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FaRegStar className="text-5xl mx-auto mb-3 text-gray-200" />
          <p>No reviews yet. Be the first to review this business.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-2xl p-5 bg-white hover:shadow-sm transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <FaUserCircle className="text-2xl" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">
                      {review.name || "Guest"}
                    </h4>
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded-md text-sm font-bold flex items-center gap-1">
                      {review.rating} <FaStar className="text-xs" />
                    </span>
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-sm ${
                          star <= Number(review.rating)
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment || "No comment added."}
                  </p>

                  {review.createdAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
