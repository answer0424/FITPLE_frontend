import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import adminApi from '../apis/admin';

const Modal = ({ review, onClose }) => {
  if (!review) return null;

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'star-active' : 'star-inactive'}`}
      />
    ));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">리뷰 상세 내용</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        <div className="modal-body">
          <div className="review-info">
            <div className="review-rating">
              <div className="star-rating">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="review-text">
              <p>{review.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewList = () => {
  const [reviews, setReviews] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleViewDetails = async (reviewId) => {
    try {
      const reviewDetail = await adminApi.getReviewDetail(reviewId);
      setSelectedReview(reviewDetail);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch review details:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await adminApi.deleteReview(reviewId);
        fetchReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'star-active' : 'star-inactive'}`}
      />
    ));
  };

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <div>
        <h2 className="panel-title">리뷰 관리</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead className="admin-table-header">
            <tr>
              <th className="admin-table-th">ID</th>
              <th className="admin-table-th">작성자</th>
              <th className="admin-table-th">트레이너</th>
              <th className="admin-table-th">상세보기</th>
              <th className="admin-table-th">관리</th>
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {reviews.content.map((review) => (
              <tr key={review.id}>
                <td className="admin-table-td">{review.id}</td>
                <td className="admin-table-td">{review.username}</td>
                <td className="admin-table-td">{review.trainerName}</td>
                <td className="admin-table-td">
                  <button
                    className="view-button"
                    onClick={() => handleViewDetails(review.id)}
                  >
                    상세보기
                  </button>
                </td>
                <td className="admin-table-td">
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    삭제하기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <Modal
          review={selectedReview}
          onClose={() => {
            setShowModal(false);
            setSelectedReview(null);
          }}
        />
      )}

      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="pagination-text">
          Page {page + 1} of {reviews.totalPages}
        </span>
        <button
          className="pagination-button"
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