// TrainerSignUp.js
import React from "react";
import RegisterForm from "../components/RegisterForm";

const trainerQuestions = [
  "이메일을 입력해주세요",
  "아이디를 입력해주세요",
  "비밀번호를 입력해주세요",
  "비밀번호를 다시 입력해주세요",
  "닉네임을 입력해주세요",
  "생년월일을 입력해주세요",
  "운동 중인 체육관을 입력해주세요",
];

const TrainerRegister = () => {
  const handleTrainerSubmit = (answers) => {
    alert("Trainer registration submitted successfully!");

  };

  return (
    <RegisterForm
      questions={trainerQuestions}
      userType="trainer" 
      onSubmit={handleTrainerSubmit}
    />
  );
};

export default TrainerRegister;
