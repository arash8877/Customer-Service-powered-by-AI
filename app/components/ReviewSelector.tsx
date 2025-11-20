"use client";

import { Review } from "@/app/lib/types";

interface ReviewSelectorProps {
  reviews: Review[];
  selectedReviewId: string | null;
  onSelectReview: (reviewId: string) => void;
}

export function ReviewSelector({
  reviews,
  selectedReviewId,
  onSelectReview,
}: ReviewSelectorProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-300";
      case "negative":
        return "bg-red-100 text-red-800 border-red-300";
      case "neutral":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {reviews.length} items
        </p>
      </div>
      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 custom-scroll">
        {reviews.map((review) => {
          const isSelected = selectedReviewId === review.id;
          return (
            <button
              key={review.id}
              type="button"
              onClick={() => onSelectReview(review.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {review.customerName}
                  </span>
                  <span className="text-yellow-500 text-xs">
                    {getRatingStars(review.rating)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {review.answered && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded border bg-blue-100 text-blue-800 border-blue-300">
                      Answered
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${getSentimentColor(
                      review.sentiment
                    )}`}
                  >
                    {review.sentiment}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {review.text}
                </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

