import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Carousel, Card, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const TrainerMatchList = ({ userId }) => {
  const [trainers, setTrainers] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatchingTrainers = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${import.meta.env.VITE_Server}/api/quiz/${userId}/result/match`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 204) {
          setTrainers([]);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch trainers");
        }

        const data = await response.json();
        console.log("트레이너 정보:", data);

        setTrainers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId) {
      fetchMatchingTrainers();
    }
  }, [userId]);

  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!trainers)
    return <Spinner animation="border" className="d-block mx-auto mt-4" />;

  return (
    <Carousel
      interval={null}
      className="w-75 mx-auto"
      indicators={trainers.length > 1} // 트레이너가 1명 이하일 때 인디케이터 숨김
      controls={trainers.length > 1} // 트레이너가 1명 이하일 때 화살표 숨김
      wrap={trainers.length > 1} // 트레이너가 1명 이하이면 넘기기 불가능
    >
      {trainers.map((trainer) => (
        <Carousel.Item key={trainer.trainerId} className="carousel-item-custom">
          <Card
            className="text-center shadow-lg mx-auto position-relative"
            style={{
              width: "490px",
              height: "600px",
              overflow: "hidden",
            }}
          >
            {/* 이미지 컨테이너 */}
            <div style={{ position: "relative", height: "100%" }}>
              <Card.Img
                variant="top"
                src={`${import.meta.env.VITE_Server}${trainer.profileImage}`}
                alt={trainer.trainerName}
                style={{ height: "100%", objectFit: "cover" }}
              />

              {/* 오버레이 카드 본문 */}
              <Card.Body
                style={{
                  position: "absolute",
                  width: "60%",
                  left: "30px",
                  bottom: "5px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // 반투명 흰색
                  color: "black",
                  padding: "10px",
                }}
              >
                <Card.Title>{trainer.trainerName}</Card.Title>
                <Card.Text>
                  <strong>닉네임:</strong> {trainer.nickname} <br />
                  <strong>HBTI:</strong> {trainer.hbti} <br />
                  <strong>헬스장:</strong> {trainer.gymName}
                </Card.Text>
                {/* 상세 페이지 버튼 */}
                <Button
                  onClick={() => navigate(`/trainer/${trainer.trainerId}/detail`)}
                  variant="dark"
                >
                  상세페이지
                </Button>
              </Card.Body>
            </div>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default TrainerMatchList;
