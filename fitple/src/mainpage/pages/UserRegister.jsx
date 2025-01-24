// UserSignUp.js
import React from "react";
import RegisterForm from "../components/RegisterForm";

const userQuestions = [
  "Enter your email address",
  "Enter your id",
  "Enter your password",
  "Confirm your password",
  "Enter your nickname",
  "Enter your date of birth",
  "Enter your home address",
];

const UserRegister = () => {
  const handleUserSubmit = (answers) => {
    alert("User registration submitted successfully!");
    console.log("User Data:", answers);
  };

  return <RegisterForm questions={userQuestions} onSubmit={handleUserSubmit} />;
};

export default UserRegister;
