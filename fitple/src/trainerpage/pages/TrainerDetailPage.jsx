import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TrainerCertifications from "../components/TrainerCertifications";
import TrainerReviews from "../components/TrainerReviews";
import TrainerHome from "../components/TrainerHome"; 
import "../components/css/TrainerDetailPage.css";
import Header from "../../common/component/Header";

function TrainerDetailPage() {
    const { trainerId } = useParams();
    const [trainer, setTrainer] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState("home");

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (!trainerId) return;

        // 트레이너 상세 정보 가져오기
        fetch(`${BASE_URL}/quiz/trainers/${trainerId}/detail`)
            .then((res) => res.json())
            .then((data) => {
                console.log("✅ 트레이너 데이터 로드 성공:", data);
                setTrainer(data);
            })
            .catch((error) => console.error("❌ 트레이너 데이터 불러오기 실패:", error));

        // 트레이너 리뷰 가져오기
        fetch(`${BASE_URL}/api/reviews/training/${trainerId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("✅ 리뷰 데이터 로드 성공:", data);
                setReviews(data);
            })
            .catch((error) => console.error("❌ 리뷰 데이터 불러오기 실패:", error));
    }, [trainerId]);

    // 리뷰 평점 계산 함수
    const calculateAverageRating = (reviews) => {
        if (!reviews.length) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1); // 소수점 첫째 자리까지 계산
    };

    // 별점 컴포넌트
    const renderStars = (averageRating) => {
        const fullStars = Math.floor(averageRating);
        const halfStar = averageRating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="rating">
                {Array(fullStars).fill("⭐️")}
                {halfStar && "⭐️"}
                {Array(emptyStars).fill("☆")}
            </div>
        );
    };

    if (!trainer) return <p className="text-center">로딩 중...</p>;

    const averageRating = calculateAverageRating(reviews);

    return (
        <>
            <Header />

            {/* 메인 컨텐츠 */}
            <div className="trainer-container">
                <div className="trainer-card">
                    {/* 상단 트레이너 정보 */}
                    <div className="trainer-header">
                        <div className="profile-section">
                            <img
                                src={`${BASE_URL}${trainer.trainerProfileImage}`}
                                alt={`${trainer.trainerName} 프로필`}
                                className="profile-image"
                            />
                            <h1 className="trainer-name">{trainer.trainerName}</h1>
                            {renderStars(averageRating)}
                            <p className="rating-text">{averageRating}점</p>
                        </div>
                        <div className="info-section">
                            <p>
                                <strong>1회 PT 가격:</strong> {trainer.perPrice.toLocaleString()}원
                            </p>
                            <p>
                                <strong>헬스장:</strong> {trainer.gymName || "정보 없음"}
                            </p>
                            <p>
                                <strong>연차:</strong> 2년
                            </p>
                            <p>
                                <strong>HBTI:</strong> {trainer.hbti || "정보 없음"}
                            </p>
                        </div>
                    </div>

                    {/* 탭 네비게이션 */}
                    <div className="trainer-tabs">
                        <button
                            className={`tab-button ${activeTab === "home" ? "active" : ""}`}
                            onClick={() => setActiveTab("home")}
                        >
                            홈
                        </button>
                        <button
                            className={`tab-button ${activeTab === "career" ? "active" : ""}`}
                            onClick={() => setActiveTab("career")}
                        >
                            경력
                        </button>
                        <button
                            className={`tab-button ${activeTab === "review" ? "active" : ""}`}
                            onClick={() => setActiveTab("review")}
                        >
                            리뷰
                        </button>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className="tab-content">
                        {activeTab === "home" && (
                            <TrainerHome
                                content={trainer.content}
                                galleryImages={trainer.galleryImages}
                                gymName={trainer.gymName}
                                gymAddress={trainer.gymAddress}
                                gymLatitude={trainer.gymLatitude}
                                gymLongitude={trainer.gymLongitude}
                            />
                        )}
                        {activeTab === "career" && (
                            <TrainerCertifications certifications={trainer.certifications} BASE_URL={BASE_URL} />
                        )}
                        {activeTab === "review" && (
                            <TrainerReviews reviews={reviews} BASE_URL={BASE_URL} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TrainerDetailPage;
