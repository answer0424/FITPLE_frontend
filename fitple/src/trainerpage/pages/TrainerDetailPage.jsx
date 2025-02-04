import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TrainerCertifications from "../components/TrainerCertifications";
import TrainerReviews from "../components/TrainerReviews";
import TrainerHome from "../components/TrainerHome"; 
import TrainerStatusModal from "../components/TrainerStatusModal"; // 모달 컴포넌트 추가
import "../components/css/TrainerDetailPage.css";
import Header from "../../common/component/Header";
import Cookies from "js-cookie";
import { FaCommentDots } from "react-icons/fa"; // FontAwesome 채팅 아이콘

function TrainerDetailPage() {
    const { trainerId } = useParams();
    const navigate = useNavigate();
    const [trainer, setTrainer] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState("home");
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const BASE_URL = import.meta.env.VITE_Server;

    const fetchTrainerDetails = async (token) => {
        try {
            const trainerResponse = await fetch(`${BASE_URL}/quiz/trainers/${trainerId}/detail`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!trainerResponse.ok) throw new Error("트레이너 정보를 불러오는 데 실패했습니다.");

            const trainerData = await trainerResponse.json();
            console.log("트레이너의 받아온 정보", trainerData);
            setTrainer(trainerData);

            const reviewsResponse = await fetch(`${BASE_URL}/api/reviews/training/${trainerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

         if(reviewsResponse.status === 404){
            console.warn("리뷰 없음: 빈 배열로 설정");
            setReviews([]);

         }else if (!reviewsResponse.ok){
            throw new Error("리뷰 데이터를 불러오는 데 실패했습니다");

         }else{
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);
         }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = Cookies.get("accessToken");
                if (!token) {
                    navigate("/login");
                    return;
                }
                console.log("사용하는 JWT 토큰", token);

                const userResponse = await fetch(`${BASE_URL}/register/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                    console.log(userData);
                } else {
                    console.error("사용자 정보를 가져오는 데 실패했습니다.");
                    navigate("/login");
                    return;
                }

                const tokenValidationResponse = await fetch(`${BASE_URL}/auth/validate-token`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (tokenValidationResponse.status === 401) {
                    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
                        method: "POST",
                        credentials: "include",
                    });

                    if (refreshResponse.ok) {
                        const { accessToken } = await refreshResponse.json();
                        Cookies.set("accessToken", accessToken, { expires: 1 });
                        token = accessToken;
                    } else {
                        navigate("/login");
                        return;
                    }
                }

                await fetchTrainerDetails(token);
            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        fetchData();
    }, [trainerId, navigate]);

    const calculateAverageRating = (reviews) => {
        if (!reviews.length) return 0;
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    const calculateYears = (careerStartDate) => {
        if (!careerStartDate) return "정보 없음";
        const startYear = new Date(careerStartDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return `${currentYear - startYear}년`;
    };

    const renderStars = (averageRating) => {
        const fullStars = Math.floor(averageRating);
        const decimalPart = averageRating - fullStars;
        const halfStar = decimalPart >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <div className="rating">
                {Array(fullStars)
                    .fill(null)
                    .map((_, i) => (
                        <span key={`full-${i}`} className="full-star">★</span>
                    ))}
                {halfStar === 1 && <span className="half-star">★</span>}
                {Array(emptyStars)
                    .fill(null)
                    .map((_, i) => (
                        <span key={`empty-${i}`} className="empty-star">☆</span>
                    ))}
            </div>
        );
    };

    if (error) return <p className="text-center text-danger">{error}</p>;
    if (!trainer) return <p className="text-center">로딩 중...</p>;

    const averageRating = calculateAverageRating(reviews);

    return (
        <>
            <Header />
            {/* 상태가 대기나 거절일 경우 모달 표시 */}
            {trainer.isAccess === "대기" || trainer.isAccess === "거절" ? (
                <TrainerStatusModal isAccess={trainer.isAccess} trainerId={trainer.id} />
            ) : (
                <div className="trainer-container">
                    <div className="trainer-card">
                        <div className="trainer-header">
                            <div className="profile-section">
                                <img
                                    src={`${BASE_URL}${trainer.trainerProfileImage}`}
                                    alt={`${trainer.trainerName} 프로필`}
                                    className="profile-image"
                                    onError={(e) => (e.target.src = "/icons/certificate-icon.png")}
                                />
                            </div>
                            <div className="info-section">
                                <h1 className="trainer-name">{trainer.trainerName}</h1>
                                {renderStars(averageRating)}
                                <p className="rating-text">{averageRating}점</p>
                                <div className="extra-info">
                                    <div className="info-box">
                                        <p><strong>연차:</strong> {calculateYears(trainer.career)}</p>
                                    </div>
                                    <div className="info-box">
                                        <p><strong>HBTI:</strong> {trainer.hbti || "정보 없음"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="details-section">
                                <div className="detail-box">
                                    <p><strong>1회 PT 가격:</strong></p>
                                    <p>{trainer.perPrice.toLocaleString()}원</p>
                                </div>
                                <div className="detail-box">
                                    <p><strong>헬스장:</strong></p>
                                    <p>{trainer.gymName || "정보 없음"}</p>
                                </div>
                                <div className="detail-box">
                                     <button
                                            className="btn btn-primary chat-button"
                                            onClick={() => navigate(`/chat/${trainerId}`)}
                                        >
                                            <FaCommentDots style={{ marginRight: "10px" }} /> 채팅문의
                                        </button>
                                </div>
                            </div>
                        </div>
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
                              리뷰 ({reviews.length})
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === "home" && <TrainerHome {...trainer} />}
                            {activeTab === "career" && (
                                <TrainerCertifications certifications={trainer.certifications} BASE_URL={BASE_URL} />
                            )}
                            {activeTab === "review" && (
                                <TrainerReviews
                                    reviews={reviews}
                                    setReviews={setReviews}
                                    BASE_URL={BASE_URL}
                                    user={user}
                                    trainerId={trainerId}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TrainerDetailPage;
