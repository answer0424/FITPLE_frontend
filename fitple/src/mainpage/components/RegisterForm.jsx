import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles/App.css";
import { Link } from "react-router-dom";
import Header from "../../common/component/Header";
import KakaoSearch from "./KakaoSearch";

const RegisterForm = ({ questions = [], onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [birthDate, setBirthDate] = useState(null);
  const [isUserSignUp, setIsUserSignUp] = useState(true);

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === 3 && answers[2] !== answers[3]) {
      alert("Passwords do not match!");
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleDateChange = (date, index) => {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    setBirthDate(date);
    handleAnswerChange(
      { target: { value: utcDate.toISOString().split("T")[0] } },
      index
    );
  };

  const handlePlaceSelect = (place) => {
    // 선택된 장소의 주소, 위도, 경도를 배열로 저장
    const placeInfo = [place.address, place.lat, place.lng];

    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[6] = JSON.stringify(placeInfo); // 7번째 질문 인덱스에 선택한 장소 정보 저장
      return newAnswers;
    });
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="App">
      <Header />
      <div>
        <h2>User Sign up</h2>
        <Link to={"/signUp/user"}>
          <button>User</button>
        </Link>
        <Link to={"/signUp/trainer"}>
          <button>Trainer</button>
        </Link>
      </div>
      <div className="progress-bar-container">
        <motion.div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
          animate={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="answers">
        {answers.map(
          (answer, index) =>
            index < currentQuestionIndex && (
              <div key={index} className="answer-item">
                <strong>{questions[index]}</strong>
                <p>
                  {index === 2 || index === 3
                    ? "*".repeat(answer.length)
                    : answer}
                </p>
              </div>
            )
        )}
      </div>

      <AnimatePresence>
        <motion.div
          key={currentQuestionIndex}
          className="question-container"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
        >
          <h2>{questions[currentQuestionIndex]}</h2>
          <div className="input-container">
            {currentQuestionIndex === 6 ? (
              <KakaoSearch onPlaceSelect={handlePlaceSelect} />
            ) : currentQuestionIndex === 5 || currentQuestionIndex === 7 ? (
              <DatePicker
                selected={birthDate}
                onChange={(date) =>
                  handleDateChange(date, currentQuestionIndex)
                }
                dateFormat="yyyy/MM/dd"
                placeholderText="Select your birth date"
                className="date-picker-input"
              />
            ) : (
              <input
                type={
                  currentQuestionIndex === 2 || currentQuestionIndex === 3
                    ? "password"
                    : "text"
                }
                placeholder="Type your answer here..."
                value={answers[currentQuestionIndex]}
                onChange={(e) => handleAnswerChange(e, currentQuestionIndex)}
              />
            )}

            {currentQuestionIndex === 3 && (
              <p
                style={{
                  color: answers[2] === answers[3] ? "green" : "red",
                  marginTop: "5px",
                }}
              >
                {answers[2] === answers[3]
                  ? "Passwords match!"
                  : "Passwords do not match."}
              </p>
            )}

            <div className="button-container">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Back
              </button>
              <button onClick={handleNextQuestion}>
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RegisterForm;
