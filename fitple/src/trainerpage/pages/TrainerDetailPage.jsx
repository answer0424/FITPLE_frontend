import React, { useEffect, useState, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TrainerCertifications from "../components/TrainerCertifications";
import TrainerReviews from "../components/TrainerReviews";
import TrainerHome from "../components/TrainerHome";
import TrainerStatusModal from "../components/TrainerStatusModal";
import "../static/css/TrainerDetailPage.css";
import Header from "../../common/component/Header";
import Cookies from "js-cookie";
import { FaCommentDots } from "react-icons/fa";
import ChatIcon from "../../common/component/ChatIcon";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import { createChat } from "../../mainpage/apis/chat";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import deImg from "../../assets/userProfileBasic.png"

function TrainerDetailPage() {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [matchedTrainingId, setMatchedTrainingId] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { isLogin, userInfo } = useContext(LoginContext);

  const BASE_URL = import.meta.env.VITE_Server;

  const handleChatClick = async () => {
    const token = await validateAndRefreshToken();
    if (!token) return;

    try {
      const response = await createChat(userInfo.id, trainerId);

      alert("채팅방 생성 성공!!");
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
      alert("채팅방을 생성하는 데 실패했습니다.");
    }
  };

  // ✅ 토큰 유효성 검증 후 재발급 처리 함수 추가
  const validateAndRefreshToken = async () => {
    let token = Cookies.get("accessToken");

    if (!token) {
      console.warn("토큰이 없습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return null;
    }

    const tokenValidationResponse = await fetch(
      `${BASE_URL}/auth/validate-token`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (tokenValidationResponse.status === 401) {
      console.warn("토큰이 만료되었습니다. 새 토큰을 요청합니다.");
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const { accessToken } = await refreshResponse.json();
        Cookies.set("accessToken", accessToken, { expires: 1 });

        return accessToken;
      } else {
        console.error("토큰 갱신 실패. 다시 로그인해야 합니다.");
        navigate("/login");
        return null;
      }
    }

    return token;
  };

  // ✅ 초기 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = Cookies.get("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // ✅ 사용자 정보 가져오기
        const userResponse = await fetch(`${BASE_URL}/register/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // ✅ 트레이너 및 리뷰 데이터 가져오기
          await fetchTrainerDetails(token, userData);
        } else {
          console.error("사용자 정보를 가져오는 데 실패했습니다.");
          navigate("/login");
          return;
        }

        // ✅ 토큰 유효성 검사 및 갱신
        const tokenValidationResponse = await fetch(
          `${BASE_URL}/auth/validate-token`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (tokenValidationResponse.status === 401) {
          const refreshResponse = await fetch(
            `${BASE_URL}/auth/refresh-token`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (refreshResponse.ok) {
            const { accessToken } = await refreshResponse.json();
            Cookies.set("accessToken", accessToken, { expires: 1 });
            token = accessToken;
          } else {
            navigate("/login");
            return;
          }
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchData();
  }, [trainerId, navigate]);

  const MySwal = withReactContent(Swal);
  const fetchTrainerDetails = async (token, userData) => {
    try {
      // ✅ 트레이너 상세 정보 가져오기
      const trainerResponse = await fetch(
        `${BASE_URL}/quiz/trainers/${trainerId}/detail`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!trainerResponse.ok) {
        throw new Error("트레이너 정보를 불러오는 데 실패했습니다.");
      }

      const trainerData = await trainerResponse.json();

      setTrainer(trainerData);

      const reviewsResponse = await fetch(
        `${BASE_URL}/api/reviews/training/${trainerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (reviewsResponse.status === 404) {
        setReviews([]);
      } else if (!reviewsResponse.ok) {
        throw new Error("리뷰 데이터를 불러오는 데 실패했습니다");
      } else {
        const reviewsData = await reviewsResponse.json();

        setReviews(reviewsData);

        const matchingTraining = reviewsData.find(
          (review) => review.userId === userData.id
        );

        if (matchingTraining) {
          setMatchedTrainingId(matchingTraining.trainingId);
        } else {
          console.warn("현재 로그인한 유저와 매칭된 트레이닝 ID가 없습니다.");
          setMatchedTrainingId(null);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      MySwal.fire({
        title: "트레이너 정보 없음",
        text: "해당 트레이너의 정보를 불러올 수 없습니다. 작성부터 해주세요",
        icon: "warning",
        confirmButtonText: "확인",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/member/detail/write");
        }
      });
    }
  };

  // ✅ 평균 평점 계산
  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // ✅ 유효한 리뷰만 필터링
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => review.rating && review.content);
  }, [reviews]);

  // ✅ 트레이너 경력 연차 계산
  const calculateYears = (careerStartDate) => {
    if (!careerStartDate) return "정보 없음";
    const startYear = new Date(careerStartDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return `${currentYear - startYear}년`;
  };

  // ✅ 평점 별 아이콘 렌더링
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
            <span key={`full-${i}`} className="full-star">
              ★
            </span>
          ))}
        {halfStar === 1 && <span className="half-star">★</span>}
        {Array(emptyStars)
          .fill(null)
          .map((_, i) => (
            <span key={`empty-${i}`} className="empty-star">
              ☆
            </span>
          ))}
      </div>
    );
  };

  if (error) return <p className="text-center text-danger">{error}</p>;
  if (!trainer) return <p className="text-center">로딩 중...</p>;

  const averageRating = calculateAverageRating(filteredReviews);
  const handleEditClick = () => {
    navigate(`/member/detail/write`);
  };

  return (
    <>
      <Header />

      {!trainer ||
      trainer.isAccess === "대기" ||
      trainer.isAccess === "거절" ? (
        <TrainerStatusModal trainer={trainer} />
      ) : (
        <div className="trainer-container">
          <div className="trainer-card">
            <div className="trainer-header">
              <div className="profile-section">
                <img
                  src={`${BASE_URL}/${trainer.trainerProfileImage}`}
                  alt={`${trainer.trainerName} 프로필`}
                  className="profile-image1"
                  onError={(e) =>
                    (e.target.src = deImg)
                  }
                />
              </div>
              <div className="info-section">
                <h1 className="trainer-name kr-font">{trainer.trainerName}</h1>
                {renderStars(averageRating)}
                <p className="rating-text kr-font">{averageRating}점</p>
                <div className="extra-info">
                  <div className="info-box">
                    <p className="kr-font">
                      <strong className="kr-font">연차:</strong>{" "}
                      {calculateYears(trainer.career)}
                    </p>
                  </div>
                  <div className="info-box">
                    <p className="kr-font">
                      <strong className="kr-font">HBTI:</strong>{" "}
                      {trainer.hbti || "정보 없음"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="details-section">
                <div className="detail-box">
                  <p>
                    <strong className="kr-font">1회 PT 가격:</strong>
                  </p>
                  <p className="kr-font">
                    {trainer.perPrice.toLocaleString()}원
                  </p>
                </div>
                <div className="detail-box">
                  <p>
                    <strong className="kr-font">헬스장:</strong>
                  </p>
                  <p className="kr-font">{trainer.gymName || "정보 없음"}</p>
                </div>
                <div className="detail-box">
                  <button
                    className="btn btn-primary chat-button kr-font"
                    onClick={handleChatClick} // 채팅 클릭 시 채팅방 생성 함수 호출
                  >
                    <FaCommentDots style={{ marginRight: "10px" }} /> 채팅문의
                  </button>
                </div>
              </div>
            </div>
            {/* 수정하기 버튼 (조건부 렌더링) */}
            {user && user.id === trainer.trainerId && (
              <button
                className="btn btn-warning edit-button kr-font"
                onClick={handleEditClick}
              >
                수정하기
              </button>
            )}

            <div className="trainer-tabs ">
              <button
                className={`tab-button kr-font ${
                  activeTab === "home" ? "active" : ""
                }`}
                onClick={() => setActiveTab("home")}
              >
                홈
              </button>
              <button
                className={`tab-button kr-font ${
                  activeTab === "career" ? "active" : ""
                }`}
                onClick={() => setActiveTab("career")}
              >
                경력
              </button>
              <button
                className={`tab-button kr-font ${
                  activeTab === "review" ? "active" : ""
                }`}
                onClick={() => setActiveTab("review")}
              >
                리뷰 ({filteredReviews.length})
              </button>
            </div>
            <div className="tab-content">
              {activeTab === "home" && <TrainerHome {...trainer} />}
              {activeTab === "career" && (
                <TrainerCertifications
                  certifications={trainer.certifications}
                  BASE_URL={BASE_URL}
                />
              )}
              {activeTab === "review" && (
                <TrainerReviews
                  reviews={reviews}
                  setReviews={setReviews}
                  BASE_URL={BASE_URL}
                  user={user}
                  trainerId={trainerId}
                  trainingId={matchedTrainingId}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {isLogin && <ChatIcon />}
    </>
  );
}

export default TrainerDetailPage;
