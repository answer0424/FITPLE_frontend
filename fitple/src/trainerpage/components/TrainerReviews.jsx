import React, { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import "../components/css/TrainerReviews.css";

function TrainerReviews({ trainerId, BASE_URL, trainingId, user }) {
    const [reviews, setReviews] = useState([]); // 리뷰 목록
    const [reviewContent, setReviewContent] = useState(""); // 작성 중인 리뷰 내용
    const [rating, setRating] = useState(5); // 작성 중인 평점
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [error, setError] = useState(""); // 에러 메시지
    const [sortOption, setSortOption] = useState("latest"); // 정렬 옵션
    const token = Cookies.get("accessToken"); // JWT 토큰

    // ✅ 유효한 리뷰만 필터링
    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => review.rating && review.content);
    }, [reviews]);

    // ✅ 리뷰 목록 불러오기
    const fetchReviews = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/reviews/training/${trainerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("리뷰 데이터를 불러오는 데 실패했습니다.");
            const data = await response.json();
            setReviews(data);
            console.log("리뷰 데이터:", data);
        } catch (err) {
            console.error("리뷰 불러오기 에러:", err.message);
        }
    };

    // ✅ 리뷰 정렬 함수
    const getSortedReviews = () => {
        const sortedReviews = [...filteredReviews];
        if (sortOption === "latest") {
            sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순
        } else if (sortOption === "highest") {
            sortedReviews.sort((a, b) => b.rating - a.rating); // 별점 높은 순
        } else if (sortOption === "lowest") {
            sortedReviews.sort((a, b) => a.rating - b.rating); // 별점 낮은 순
        }
        return sortedReviews;
    };

    const handleSubmitReview = async () => {
        if (!reviewContent.trim()) {
            setError("리뷰 내용을 입력해주세요.");
            return;
        }
    
        if (!trainingId) {
            setError("트레이닝 ID가 없습니다. 리뷰를 작성할 수 없습니다.");
            return;
        }
    
        try {
            // SweetAlert2로 확인 다이얼로그 표시
            const result = await Swal.fire({
                title: "리뷰를 제출하시겠습니까?",
                text: "제출 이후에는 수정할 수 없습니다.",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "제출",
                cancelButtonText: "취소",
            });
    
            // 사용자가 "제출"을 클릭한 경우에만 진행
            if (result.isConfirmed) {
                const response = await fetch(`${BASE_URL}/api/reviews/training/${trainingId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ rating, content: reviewContent }),
                });
    
                if (!response.ok) throw new Error("리뷰 작성에 실패했습니다.");
                
                const newReview = await response.json();
                setReviews((prevReviews) => [newReview, ...prevReviews]); // UI 업데이트
    
                // 성공 SweetAlert 띄운 뒤 새로고침
                await Swal.fire({
                    title: "리뷰 작성 완료!",
                    text: "리뷰가 성공적으로 제출되었습니다.",
                    icon: "success",
                });
    
                // 새로고침
                window.location.reload();
            }
        } catch (err) {
            console.error("리뷰 작성 에러:", err.message);
    
            // SweetAlert2로 에러 메시지 표시
            await Swal.fire({
                title: "리뷰 작성 불가",
                text: "리뷰는 한 개만 작성할 수 있습니다.",
                icon: "error",
            });
    
            setError("리뷰는 한 개만 작성할 수 있습니다.");
        }
    };
    


    // ✅ 리뷰 삭제 (SweetAlert2 추가)
    const handleDeleteReview = async (reviewId) => {
        Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제 후에는 복구할 수 없습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (!response.ok) throw new Error("리뷰 삭제에 실패했습니다.");

                    window.location.reload();

                    Swal.fire("삭제 완료", "리뷰가 삭제되었습니다.", "success");
                } catch (err) {
                    console.error("리뷰 삭제 에러:", err.message);
                    setError("리뷰 삭제 중 문제가 발생했습니다. 다시 시도해주세요.");
                }
            }
        });
    };

    // ✅ 별점 렌더링 함수
    const renderStars = (rating) => {
        return Array(5)
            .fill(null)
            .map((_, index) => (
                <span key={index} style={{ color: index < rating ? "#FFD700" : "#ccc" }}>
                    ★
                </span>
            ));
    };

    useEffect(() => {
        fetchReviews();
    }, [trainerId]);

    return (
        <div>
        <h3>리뷰 목록</h3>
    
{/* 상단 컨트롤 섹션 */}
<div className="controls-container">
    <button
        className="review-submit-button col-3"
        onClick={() => setIsModalOpen(true)}
        disabled={!trainingId} // 트레이닝 ID가 없으면 버튼 비활성화
    >
        리뷰 작성
    </button>
    <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="form-select"
    >
        <option value="latest">최신순</option>
        <option value="highest">별점 높은 순</option>
        <option value="lowest">별점 낮은 순</option>
    </select>
</div>
    
        {filteredReviews.length > 0 ? (
   <ul>
    {getSortedReviews().map((review) => (
      <li key={review.id} className="review-item">
       <img
                            src={`${BASE_URL}${review.userProfileImage}`}
                            alt={`${review.username} 프로필`}
                            className="review-profile-image"
                            onError={(e) => (e.target.src = "/src/assets/logo.png")}
                        />
        <div className="review-content">
          <p>
            {review.username}
            <span className="review-stars">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
          </p>
          <p>{review.content}</p>
          <p className="review-date">
            {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>
        {user && review.userId === user.id && (
          <button className="delete-btn col-3" onClick={() => handleDeleteReview(review.id)}>
            삭제
          </button>
        )}
      </li>
    ))}
  </ul>
        ) : (
            <p>리뷰가 없습니다.</p>
        )}
 

                {isModalOpen && (
                    <div className="modal1">
                        <div className="modal-content1">
                            <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
                            <h3 className="modal-title">솔직한 후기를 남겨주세요!</h3>
                            <p className="modal-description">
                                일반 이용 후기 작성 요령
                            </p>
                            <div className="modal-guidelines">
                    <ul>
                        <li>• 솔직하고 구체적인 피드백을 작성해주세요.</li>
                        <li>• 경험하신 트레이닝의 장점과 개선점을 적어주시면 더욱 도움이 됩니다.</li>
                        <li>• 다른 사용자들에게 도움이 될 만한 팁이나 조언을 포함해주세요.</li>
                        <li>• 비속어나 부적절한 표현은 삼가주세요.</li>
                    </ul>
                </div>

                            {/* 별점 선택 */}
                            <div className="rating-section">
                                <label>별점을 선택해주세요</label>
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`star ${rating >= star ? "selected" : ""}`}
                                            onClick={() => setRating(star)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 리뷰 내용 입력 */}
                            <div className="textarea-section">
                                <label>내용을 작성해주세요</label>
                                <textarea
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                    placeholder="내용을 입력해주세요"
                                    maxLength={400}
                                />
                                <p className="char-count">{reviewContent.length}/400</p>
                            </div>
                            {error && <p className="error-message">{error}</p>}

                            {/* 제출 버튼 */}
                            <button
                                className="submit-button"
                                onClick={handleSubmitReview}
                                disabled={reviewContent.trim() === ""}
                            >
                                리뷰 작성 완료
                            </button>
                        </div>
                    </div>
                )}

        </div>
    );
}

export default TrainerReviews;
