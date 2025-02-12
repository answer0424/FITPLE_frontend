import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // 추가

const TrainerSearchList = () => {
  const [trainers, setTrainers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [visibleTrainers, setVisibleTrainers] = useState(3);
  const navigate = useNavigate();
  const observer = useRef();

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const accessToken = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8081/api/quiz/search",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { searchQuery },
          }
        );
        setTrainers(response.data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, [searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setVisibleTrainers(3);
  };

  const handleTrainerClick = (trainer) => {
    setSelectedTrainer(trainer);
    new bootstrap.Modal(document.getElementById("trainerModal")).show();
  };

  const goToDetail = () => {
    if (selectedTrainer) {
      navigate(`/trainer/${selectedTrainer.id}/detail`);
    }
  };

  const lastTrainerElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleTrainers((prev) => prev + 3);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  return (
    <div>
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#trainerModal"
      >
        트레이너 검색
      </button>
      {/* 모달 */}
      <div className="modal fade" id="trainerModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="닉네임 검색"
                className="form-control"
              />
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="list-group">
                {trainers.slice(0, visibleTrainers).map((trainer, index) => (
                  <div
                    key={trainer.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    ref={
                      index === visibleTrainers - 1
                        ? lastTrainerElementRef
                        : null
                    }
                  >
                    <div>
                      <strong style={{ color: "black" }}>
                        {trainer.nickname}
                      </strong>
                      <p className="mb-0 text-muted">
                        {trainer.hbti?.hbti || "정보 없음"}
                      </p>
                    </div>
                    <button
                      className="btn btn-dark"
                      onClick={() => navigate(`/trainer/${trainer.id}/detail`)}
                      style={{ width: "20px" }}
                    >
                      프로필
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSearchList;
