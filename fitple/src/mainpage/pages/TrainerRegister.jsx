// TrainerSignUp.js
import React from "react";
import RegisterForm from "../components/RegisterForm";

const trainerQuestions = [
  "Enter your email address",
  "Enter your id",
  "Enter your password",
  "Confirm your password",
  "Enter your nickname",
  "Enter your date of birth",
  "Enter your gym address",
];

const TrainerRegister = () => {
  const handleTrainerSubmit = (answers) => {
    alert("Trainer registration submitted successfully!");
    console.log("Trainer Data:", answers);
  };

  return (
    <RegisterForm questions={trainerQuestions} onSubmit={handleTrainerSubmit} />
  );
};

export default TrainerRegister;
