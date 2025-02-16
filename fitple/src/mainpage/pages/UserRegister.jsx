
import React from "react";
import RegisterForm from "../components/RegisterForm";

const userQuestions = [
  "이메일을 입력해주세요",
  "아이디를 입력해주세요",
  "비밀번호를 입력해주세요",
  "비밀번호를 다시 입력해주세요",
  "닉네임을 입력해주세요",
  "생년월일을 입력해주세요",
  "집 주소를 입력해주세요",
];

const UserRegister = () => {
  const handleUserSubmit = (answers) => {
    alert("User registration submitted successfully!");
    console.log("User Data:", answers);
  };

  return (
    <RegisterForm 
      questions={userQuestions} 
      userType="student" 
      onSubmit={handleUserSubmit} 
    />
  );
};

export default UserRegister;
