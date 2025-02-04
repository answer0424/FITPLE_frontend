import React, { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

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

    // ✅ 리뷰 작성
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
            const response = await fetch(`${BASE_URL}/api/reviews/training/${trainingId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, content: reviewContent }),
            });

            if (!response.ok) throw new Error("리뷰 작성에 실패했습니다.");
            window.location.reload();

            const newReview = await response.json();
            setReviews((prevReviews) => [newReview, ...prevReviews]); // UI 업데이트
            setIsModalOpen(false); // 모달 닫기
            setReviewContent(""); // 리뷰 내용 초기화
            setRating(5); // 평점 초기화
            setError(""); // 에러 메시지 초기화
            console.log("작성된 리뷰 데이터:", newReview);
        } catch (err) {
            console.error("리뷰 작성 에러:", err.message);
            setError("리뷰 작성 중 문제가 발생했습니다. 다시 시도해주세요.");
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
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!trainingId} // 트레이닝 ID가 없으면 버튼 비활성화
                >
                    리뷰 작성
                </button>

                {/* 정렬 옵션 */}
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="form-select"
                    style={{ width: "200px" }}
                >
                    <option value="latest">최신순</option>
                    <option value="highest">별점 높은 순</option>
                    <option value="lowest">별점 낮은 순</option>
                </select>
            </div>

            {filteredReviews.length > 0 ? (
                <ul>
                    {getSortedReviews().map((review) => (
                        <li key={review.id} style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                                src={`${BASE_URL}${review.userProfileImage}`}
                                alt={`${review.username} 프로필`}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                                onError={(e) => (e.target.src = "/src/assets/logo.png")}
                            />
                            <div>
                                <p>
                                    <strong>{review.username}</strong> - {renderStars(review.rating)}
                                </p>
                                <p>{review.content}</p>
                                <p style={{ fontSize: "0.8rem", color: "gray" }}>
                                    {new Date(review.createdAt).toLocaleString()}
                                </p>

                                {/* ✅ 본인이 작성한 리뷰만 삭제 가능 */}
                                {user && review.userId === user.id && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteReview(review.id)}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>리뷰가 없습니다.</p>
            )}

            {/* 리뷰 작성 모달 */}
            {isModalOpen && (
                <div className="modal" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div className="modal-content" style={{ padding: "20px", background: "white", borderRadius: "10px" }}>
                        <h4>리뷰 작성</h4>
                        <div style={{ marginBottom: "10px" }}>
                            <label>평점: </label>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <option key={star} value={star}>
                                        {star}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="리뷰를 입력하세요..."
                            maxLength={700}
                        />
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <button onClick={handleSubmitReview} className="btn btn-success">
                            제출
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrainerReviews;
