import React from "react";
import { Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import ProfileComponent from "../ProfileComponent";
import CalenderComponent from "../CalenderComponent";
import StudentsList from ".././StudentsList";

const TrainerComponent = ({ currentPage, user }) => {
  return (
    <>
      <Container>
        {currentPage === "a" && <CalenderComponent user={user} />}
        {currentPage === "b" && <StudentsList user={user} />}
      </Container>
    </>
  );
};

export default TrainerComponent;
