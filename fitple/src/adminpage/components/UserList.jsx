import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, UserX } from "lucide-react";
import adminApi from "../apis/admin";
import "bootstrap/dist/css/bootstrap.min.css";
import "../static/css/UserList.css";

const UserList = ({ setChatUsers }) => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" }); // 기본 정렬: id 기준 asc

  useEffect(() => {
    fetchAllUsers();
  }, [setUsers]);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      let allUsers = [];
      let currentPage = 0;
      let total = 0;

      do {
        const data = await adminApi.getUsers(currentPage);
        allUsers = [...allUsers, ...data.content];
        total = data.totalPages;
        currentPage++;
      } while (currentPage < total);

      setUsers(allUsers);
      setChatUsers(allUsers);
      setTotalPages(total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
    setIsLoading(false);
  };

  const handleViewTrainers = async (studentId) => {
    try {
      const trainers = await adminApi.getStudentTrainers(studentId);
      setSelectedTrainers(trainers);
      setIsModalOpen(true);
    } catch (error) {
      console.error("트레이너 정보 로딩 실패:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await adminApi.deleteUser(userId);
      fetchAllUsers(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (typeof valueA === "string") {
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
  });

  const getSortIcon = (key) => {
    return sortConfig.key === key ? (
      sortConfig.direction === "asc" ? (
        <ChevronUp size={16} />
      ) : (
        <ChevronDown size={16} />
      )
    ) : (
      <ChevronDown size={16} className="opacity-50" />
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 해줘야 함
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // yyyy-MM-dd 형식으로 반환
  };

  return (
    <div className="card card-bg-color">
      <div className="card-body">
        <h5 className="card-title en-font">User List</h5>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr className="text-align-center">
                <th
                  scope="col"
                  onClick={() => handleSort("id")}
                  className="sortable"
                >
                  # {getSortIcon("id")}
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort("username")}
                  className="sortable"
                >
                  아이디 {getSortIcon("username")}
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort("email")}
                  className="sortable"
                >
                  이메일 {getSortIcon("email")}
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort("birth")}
                  className="sortable"
                >
                  생일 {getSortIcon("birth")}
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort("nickname")}
                  className="sortable"
                >
                  닉네임 {getSortIcon("nickname")}
                </th>
                <th scope="col">트레이너 목록</th>
                <th scope="col">관리</th>
              </tr>
            </thead>
            <tbody className="text-align-center">
              {sortedUsers
                .slice(page * 10, (page + 1) * 10)
                .map((user, index) => (
                  <tr key={user.id}>
                    <th scope="row">{user.id}</th>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{formatDate(user.birth)}</td> {/* 생일 포맷팅 */}
                    <td>{user.nickname}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm btn-detail kr-font"
                        onClick={() => handleViewTrainers(user.id)}
                      >
                        상세보기
                      </button>
                    </td>
                    <td className="delete-button-center">
                      <button
                        className="btn btn-danger btn-sm d-flex align-items-center kr-font col-6"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <UserX className="h-4 w-4 me-1" />
                        삭제하기
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-secondary col-3"
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span>
            {" "}
            {page + 1} / {Math.ceil(users.length / 10)}
          </span>
          <button
            className="btn btn-secondary col-3"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= Math.ceil(users.length / 10) - 1}
          >
            Next
          </button>
        </div>
      </div>
      {/* 트레이너 목록 모달 */}
      <div
        className={`modal fade ${isModalOpen ? "show" : ""}`}
        id="trainerModal"
        tabIndex="-1"
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header col-12">
              <h5 className="modal-title">트레이너 목록</h5>
              <button
                type="button"
                className="btn-close col-2"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body bg-color">
              <table className="table">
                <thead>
                  <tr>
                    <th>트레이너 ID</th>
                    <th>아이디</th>
                    <th>이메일</th>
                    <th>남은 횟수</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTrainers.length > 0 ? (
                    selectedTrainers.map((trainer) => (
                      <tr key={trainer.trainerId}>
                        <td>{trainer.trainerId}</td>
                        <td>{trainer.name}</td>
                        <td>{trainer.email}</td>
                        <td>{trainer.remainingSessions}회</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        트레이너 없음
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer col-12">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setIsModalOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
