"use client";

import { Review, StatusFilter, ProductModelFilter, Filters } from "@/app/lib/types";

interface ReviewSelectorProps {
  reviews: Review[];
  selectedReviewId: string | null;
  onSelectReview: (reviewId: string) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function ReviewSelector({
  reviews,
  selectedReviewId,
  onSelectReview,
  filters,
  onFiltersChange,
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

      <div className="space-y-4">
        {/* Filter Section */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Filters</p>
          
          {/* Status & Sentiment Dropdown */}
          <div className="space-y-2 mb-3">
            <label htmlFor="status-filter" className="text-[10px] font-medium text-gray-500 uppercase tracking-wide block">
              Status & Sentiment
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as StatusFilter })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Reviews</option>
              <option value="answered">Answered</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          {/* Product Model Dropdown */}
          <div className="space-y-2">
            <label htmlFor="product-filter" className="text-[10px] font-medium text-gray-500 uppercase tracking-wide block">
              Product Model
            </label>
            <select
              id="product-filter"
              value={filters.productModel}
              onChange={(e) => onFiltersChange({ ...filters, productModel: e.target.value as ProductModelFilter })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Models</option>
              <option value="model-1">TV-Model 1</option>
              <option value="model-2">TV-Model 2</option>
              <option value="model-3">TV-Model 3</option>
              <option value="model-4">TV-Model 4</option>
            </select>
          </div>
        </div>
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {review.customerName}
                  </span>
                  <span className="text-yellow-500 text-xs">
                    {getRatingStars(review.rating)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    {review.answered && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded border bg-blue-100 text-blue-800 border-blue-300">
                        Answered
                      </span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded border bg-purple-100 text-purple-800 border-purple-300">
                    {review.productModel}
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

