import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; 

const TrainerSearchList = () => {
  const [trainers, setTrainers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [visibleTrainers, setVisibleTrainers] = useState(5); // 🔹 초기값 5로 변경
  const [hasMore, setHasMore] = useState(true); // 🔹 더 불러올 데이터가 있는지 여부
  const navigate = useNavigate();
  const observer = useRef(null);

  // ✅ 트레이너 목록 가져오기
  const fetchTrainers = async (query) => {
    try {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      const response = await axios.get(
        "http://localhost:8081/api/quiz/search",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { nickname: query },
        }
      );

      console.log(response.data);
      setTrainers(response.data);
      setHasMore(response.data.length > 5); // 🔹 5개보다 많으면 더 불러올 데이터가 있음
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

  // ✅ 검색어 변경 시 트레이너 목록 가져오기
  useEffect(() => {
    setVisibleTrainers(5); // 🔹 검색할 때마다 초기화 (5개부터 시작)
    fetchTrainers(searchQuery);
  }, [searchQuery]);

  // ✅ 검색 입력 핸들러
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // // ✅ 트레이너 선택 핸들러
  // const handleTrainerClick = (trainer) => {
  //   setSelectedTrainer(trainer);
  //   new bootstrap.Modal(document.getElementById("trainerModal")).show();
  // };

  // ✅ 상세 페이지 이동
  // const goToDetail = () => {
  //   if (selectedTrainer) {
  //     navigate(`/trainer/${selectedTrainer.id}/detail`);
  //     if (modalInstance) {
  //       modalInstance.hide();
  //     }
  //   }
  // };

  // ✅ 상세 페이지 이동
  const closeModal = () => {
    const modalElement = document.getElementById("trainerModal");
    if (modalElement) {
      const modalInstance = modalElement.classList.contains("show")
        ? new bootstrap.Modal(modalElement)
        : null;

      if (modalInstance) {
        modalInstance.hide(); // ✅ 모달 닫기
      }
    }
  };

  // ✅ 무한 스크롤 감지 (마지막 요소를 감지하면 더 불러옴)
  const lastTrainerElementRef = useCallback(
    (node) => {
      if (!hasMore) return; // 🔹 더 불러올 데이터가 없으면 실행하지 않음

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisibleTrainers((prev) => prev + 5); // 🔹 5개씩 추가 로딩
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div>
      <button
        className="btn"
        style={{ backgroundColor: "white", color: "black", fontWeight: "700" }}
        data-bs-toggle="modal"
        data-bs-target="#trainerModal"
      >
        트레이너 검색
      </button>

      {/* 모달 */}
      <div className="modal fade" id="trainerModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="닉네임 검색"
                className="form-control"
                autoFocus
              />
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div
              className="modal-body"
              style={{ maxHeight: "400px ", overflowY: "auto" }}
            >
              <div className="list-group">
                {trainers.length > 0 ? (
                  trainers.slice(0, visibleTrainers).map((trainer, index) => (
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
                        onClick={() => {
                          closeModal(); // ✅ 모달 닫기
                          navigate(`/trainer/${trainer.id}/detail`);
                        }}
                        data-bs-dismiss="modal"
                        style={{ width: "20px" }}
                      >
                        프로필
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">
                    검색 결과가 없습니다.
                  </p>
                )}
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
