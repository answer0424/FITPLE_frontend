import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/styles/App.css";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../common/component/Header";
import KakaoSearch from "./KakaoSearch";
import { registerStudent, registerTrainer } from '../apis/auth';

const RegisterForm = ({ questions = [], userType }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [birthDate, setBirthDate] = useState(null);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if(inputRefs.current[currentQuestionIndex]) {
      inputRefs.current[currentQuestionIndex].focus();
    }
  }, [currentQuestionIndex]);

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === 3 && answers[2] !== answers[3]) {
      alert("Passwords do not match!");
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
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
    const placeInfo = { address: place.address, lat: place.lat, lng: place.lng, gymName: place.name };

    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[6] = JSON.stringify(placeInfo);
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    const placeInfo = JSON.parse(answers[6]);
    const userData = {
      email: answers[0],
      username: answers[1],
      password: answers[2],
      nickname: answers[4],
      birth: answers[5],
      address: placeInfo.address,
      gymName: placeInfo.gymName,
      latitude: placeInfo.lat,
      longitude: placeInfo.lng,
    };

    try {
      let response;
      if (userType === 'student') {
        console.log('student 권한으로 회원가입 요청')
        response = await registerStudent(userData);
      } else if (userType === 'trainer') {
        console.log('trainer 권한으로 회원가입 요청')
        response = await registerTrainer(userData);
      }

      if (response && response.status === 200) {
        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        console.log(response);
        alert("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("There was an error registering the user:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(`회원가입에 실패했습니다: ${error.response.data.message || '이미 등록된 회원입니다.'}`);
        navigate(`/register/${userType}`)
      } else {
        console.log(response)
        alert("An error occurred during registration. Please try again.");
      }
    }
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="App">
      <Header />
      <div>
        <h2>{userType} Sign up</h2>
        <Link to={"/register/student"}>
          <button>Student</button>
        </Link>
        <Link to={"/register/trainer"}>
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
                onKeyPress={handleKeyPress} 
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
