import React from "react";
import { Container } from "react-bootstrap";
import CalenderComponent from "../CalenderComponent";
import StudentsList from "../trainer/StudentsList";
import ProfilEditComponent from '../ProfileEditComponent';

const TrainerComponent = ({ currentPage, user }) => {
  return (
    <>
      <Container>
        {currentPage === "a" && <CalenderComponent user={user} />}
        {currentPage === "b" && <StudentsList user={user} />}
        {currentPage === 'c' && <ProfilEditComponent user={user} />}
      </Container>
    </>
  );
};

export default TrainerComponent;
