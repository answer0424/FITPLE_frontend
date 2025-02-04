import React, { useState } from "react";
import Cookies from "js-cookie";

function TrainerReviews({ reviews, setReviews, BASE_URL, user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewContent, setReviewContent] = useState("");
    const [rating, setRating] = useState(5);
    const [error, setError] = useState("");

    // 📌 모달 열기 & 닫기
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setReviewContent("");
        setError("");
    };

    const handleSubmitReview = async () => {
        let token = Cookies.get("accessToken");

        if (!token) {
            console.error("❌ JWT 토큰 없음! 로그인 필요");
            return;
        }

        // ✅ 트레이닝 ID 가져오기 (리뷰 데이터에서 추출)
        const trainingId = reviews[0]?.trainingId; // 첫 번째 리뷰의 trainingId 사용
        if (!trainingId) {
            console.error("❌ trainingId가 없습니다.");
            setError("트레이닝 정보를 확인할 수 없습니다.");
            return;
        }

        console.log("✅ 서버로 보내는 trainingId:", trainingId);

        try {
            const response = await fetch(`${BASE_URL}/api/reviews/training/${trainingId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rating,
                    content: reviewContent,
                }),
            });

            if (!response.ok) {
                console.error("❌ 리뷰 작성 실패:", response.status);
                setError("리뷰 작성에 실패했습니다.");
            } else {
                const newReview = await response.json();
                console.log("✅ 새 리뷰 추가됨:", newReview);

                // ✅ 기존 리뷰 목록 앞에 새 리뷰 추가
                setReviews((prevReviews) => [newReview, ...prevReviews]);

                closeModal(); // ✅ 모달 닫기
            }
        } catch (err) {
            console.error("❌ 서버 요청 실패:", err);
            setError("서버 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h3>리뷰 목록</h3>

            {/* ✅ 리뷰 작성 버튼 */}
            {user && (
                <button
                    onClick={openModal}
                    style={{
                        marginBottom: "10px",
                        padding: "8px 12px",
                        background: "blue",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    리뷰 작성
                </button>
            )}

            {reviews.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {reviews.map((review) => (
                        <li
                            key={review.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "15px",
                            }}
                        >
                            <img
                                src={`${BASE_URL}${review.userProfileImage}`}
                                alt="유저 프로필"
                                width="50"
                                height="50"
                                style={{ borderRadius: "50%" }}
                            />
                            <div>
                                <strong>{review.username}</strong> - ⭐ {review.rating}
                                <p>{review.content}</p>
                                <p style={{ fontSize: "12px", color: "gray" }}>
                                    작성일: {new Date(review.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>아직 리뷰가 없습니다.</p>
            )}

            {/* ✅ 리뷰 작성 모달 */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                    }}
                >
                    <h3>리뷰 작성</h3>
                    <label>
                        ⭐ 평점:
                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </label>
                    <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        maxLength="700"
                        placeholder="리뷰를 입력하세요..."
                        style={{ width: "100%", height: "100px", marginTop: "10px", padding: "5px" }}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button
                        onClick={handleSubmitReview}
                        style={{
                            marginTop: "10px",
                            padding: "8px 12px",
                            background: "green",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        리뷰 제출
                    </button>
                    <button
                        onClick={closeModal}
                        style={{
                            marginLeft: "10px",
                            padding: "8px 12px",
                            background: "gray",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        닫기
                    </button>
                </div>
            )}
        </div>
    );
}

export default TrainerReviews;
