
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import adminApi from '../apis/admin';

const ReviewList = () => {
  const [reviews, setReviews] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getReviews(page);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
    setIsLoading(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md m-4 p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Review Management</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.content.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap">{review.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{review.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{review.trainerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-md truncate">
                  {review.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <button
          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="py-1">
          Page {page + 1} of {reviews.totalPages}
        </span>
        <button
          className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={page >= reviews.totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ReviewList;