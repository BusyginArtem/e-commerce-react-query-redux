import type { ProductReview } from '@/modules/products/api';

function ProductReviews({ reviews }: { reviews?: ProductReview[] }) {
  return (
    reviews &&
    reviews.length > 0 && (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Reviews</h3>
        <ul className="space-y-4">
          {reviews.map((review, idx) => (
            <li key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{review.reviewerName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <span className="text-yellow-500 font-semibold">
                Rating: {review.rating}/5
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}

export default ProductReviews;
