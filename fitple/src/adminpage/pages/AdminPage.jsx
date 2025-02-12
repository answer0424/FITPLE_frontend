import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";
import TrainerList from "../components/TrainerList";
import ReviewList from "../components/ReviewList";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import StudentAgeChart from "../components/StudentAgeChart";
import TrainerAgeChart from "../components/TrainerAgeChart";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [chatUsers, setChatUsers] = useState([]);
  const [chatTrainers, setChatTrainers] = useState([]);
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  // users 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log("유저 리스트에서 받아온 값:", chatUsers);
  }, [chatUsers, chatTrainers]); // users 상태가 변경될 때마다 실행

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <h1 className="admin-title en-font">Admin Page</h1>

        <nav className="admin-nav">
          <button onClick={goHome}>Home</button>
          <button
            className={`admin-nav-button ${
              activeTab === "users"
                ? "admin-nav-button-active"
                : "admin-nav-button-inactive"
            } `}
            onClick={() => setActiveTab("users")}
          >
            회원 목록
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "trainers"
                ? "admin-nav-button-active"
                : "admin-nav-button-inactive"
            }`}
            onClick={() => setActiveTab("trainers")}
          >
            트레이너 목록
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "reviews"
                ? "admin-nav-button-active"
                : "admin-nav-button-inactive"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            리뷰 목록
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "studentAgeChart"
                ? "admin-nav-button-active"
                : "admin-nav-button-inactive"
            }`}
            onClick={() => setActiveTab("studentAgeChart")}
          >
            회원 연령대
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "trainerAgeChart"
                ? "admin-nav-button-active"
                : "admin-nav-button-inactive"
            }`}
            onClick={() => setActiveTab("trainerAgeChart")}
          >
            트레이너 연령대
          </button>
        </nav>

        <div className="mt-4">
          {activeTab === "users" && <UserList setChatUsers={setChatUsers} />}
          {activeTab === "trainers" && <TrainerList setChatTrainers={setChatTrainers}/>}
          {activeTab === "reviews" && <ReviewList />}
          {activeTab === "studentAgeChart" && (
            <StudentAgeChart chatUsers={chatUsers} />
          )}
          {activeTab === "trainerAgeChart" && (
            <TrainerAgeChart chatTrainers={chatTrainers}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
