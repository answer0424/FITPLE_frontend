import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/TrainerMatch.css";

const TrainerMatchList = ({ userId }) => {
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
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

        
        console.log(response)

        if (response.status === 204) {
          setTrainers([]);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch trainers");
        }

        const data = await response.json();
        setTrainers(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId) {
      fetchMatchingTrainers();
    }
  }, [userId]);

  const handleScroll = (direction) => {
    if (direction === "left" && currentIndex < trainers.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else if (direction === "right" && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };


  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!trainers.length)
    return <Spinner animation="border" className="d-block mx-auto mt-4" />;

  return (
    <div className="trainer-list-wrapper">
      <button
        className="arrow-button left-arrow"
        onClick={() => handleScroll("right")}
        disabled={currentIndex === 0}
      ></button>
      <motion.div
        className="horizontal-trainer-list-container"
        animate={{
          transform: `translateX(calc(50% - ${currentIndex * 440 + 195}px))`,
        }}
        transition={{ type: "spring", stiffness: 60 }}
      >
        {trainers.map((trainer, index) => (
          <motion.div
            key={trainer.trainerId}
            className="trainer-card1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: index === currentIndex ? 1 : 0.9,
              opacity: index === currentIndex ? 1 : 0.5,
            }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={`${import.meta.env.VITE_Server}${trainer.profileImage}`}
              alt={trainer.trainerName}
            />
            <div className="trainer-info-overlay">
              <h5 className="kr-font">{trainer.nickname}</h5>
              <p className="kr-font">
                <strong>HBTI:</strong> {trainer.hbti}
              </p>
              <p className="kr-font">
                <strong>헬스장:</strong> {trainer.gymName}
              </p>
              <button
                className="kr-font"
                onClick={() => navigate(`/trainer/${trainer.trainerId}/detail`)}
              >
                상세보기
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <button
        className="arrow-button right-arrow"
        onClick={() => handleScroll("left")}
        disabled={currentIndex === trainers.length - 1}
      ></button>
    </div>
  );
};

export default TrainerMatchList;
