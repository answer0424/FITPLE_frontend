import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import adminApi from '../apis/admin';
import { UserX } from 'lucide-react';

const Modal = ({ review, onClose }) => {
  if (!review) return null;

  const renderStars = (rating) => {
    return (
      <div className="d-flex gap-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`bi bi-star-fill ${
              index < rating ? 'text-warning' : 'text-secondary'
            }`}
          ></span>
        ))}
      </div>
    );
  };

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">리뷰 상세 내용</h5>
            <button
              type="button"
              className="btn-close col-6"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="review-info">
              <div className="review-rating">
                <div className="star-rating">{renderStars(review.rating)}</div>
              </div>
              <div className="review-text font-black">
                <p>{review.content}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              닫기
            </button>
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

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <>
      <div className="card card-bg-color">
        <h5 className="card-title en-font">Review List</h5>
          <div className="card-body">
            <table className="table table-dark">
              <thead className="admin-table-header">
                <tr  className='text-align-center'>
                  <th className="admin-table-th">#</th>
                  <th className="admin-table-th">작성자</th>
                  <th className="admin-table-th">트레이너</th>
                  <th className="admin-table-th">상세보기</th>
                  <th className="admin-table-th">관리</th>
                </tr>
              </thead>
              <tbody className="admin-table-body text-align-center">
                {reviews.content.map((review) => (
                  <tr key={review.id}>
                    <td className="admin-table-td">{review.id}</td>
                    <td className="admin-table-td">{review.username}</td>
                    <td className="admin-table-td">{review.trainerName}</td>
                    <td className="admin-table-td">
                      <button
                        className="btn btn-primary btn-sm btn-detail kr-font"
                        onClick={() => handleViewDetails(review.id)}
                      >
                        상세보기
                      </button>
                    </td>
                    <td className="admin-table-td delete-button-center" >
                      <button
                        className="btn btn-danger btn-sm d-flex align-items-center kr-font col-2"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <UserX className="h-4 w-4 me-1" />
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
          {/* Pagination */}
          <div className="d-flex justify-content-between">
            <button 
                className="btn btn-secondary col-3" 
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0}
            >
                Previous
            </button>
            <span> {page + 1} / {reviews.totalPages}</span>
            <button 
                className="btn btn-secondary col-3" 
                onClick={() => setPage(prev => prev + 1)}
                disabled={page >= reviews.totalPages - 1}
            >
                Next
            </button>
          </div>
        </div>
      </>
  );
};

export default ReviewList;