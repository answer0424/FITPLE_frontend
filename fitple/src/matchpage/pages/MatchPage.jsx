import React from "react";
import TrainerMatchList from "../components/TrainerMatchList";
import { useParams } from "react-router-dom";
import Header from "../../common/component/Header";

const MatchPage = () => {
  const { userId } = useParams();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Header />
      <TrainerMatchList userId={userId} />
    </div>
  );
};

export default MatchPage;
