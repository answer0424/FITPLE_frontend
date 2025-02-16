import React, { useState, useEffect } from "react";
import { Modal, Form, Button, ListGroup, Alert } from "react-bootstrap";
import axios from "axios";
import "../static/css/SerchStudentItem.css"; // CSS 파일 import

const SearchStudentItem = ({ showModal, onClose, user, onRegister }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [times, setTimes] = useState(1);
  const [error, setError] = useState(null);

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  // 전체 학생 리스트 불러오기
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Server}/member/${user.id}/register/search`,
        {
          params: { searchQuery }, // 검색어 추가
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setAllStudents(response.data);
        setSearchResults(response.data);
      } else {
        setAllStudents([]);
        setSearchResults([]);
        setError("검색 결과가 없습니다.");
      }
    } catch (error) {
      setAllStudents([]);
      setSearchResults([]);
      setError("학생 검색 중 오류가 발생했습니다.");
    }
  };

  // 모달이 열릴 때 학생 리스트 불러오기
  useEffect(() => {
    if (showModal) {
      fetchStudents();
    }
  }, [showModal]);

  // 검색 기능
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(allStudents); // 검색어가 없으면 전체 리스트 표시
    } else {
      setSearchResults(
        allStudents.filter((student) =>
          student.nickname.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, allStudents]);

  const handleRegisterStudent = async () => {
    if (!selectedStudent) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_Server}/member/register/add-member`,
        { trainerId: user.id, studentId: selectedStudent.id, times },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("회원이 성공적으로 등록되었습니다.");
      onRegister(user.id, selectedStudent.id, times);
      onClose();
    } catch (error) {
      console.error(error);
      alert("이미 존재하는 회원입니다.");
    }
  };

  return (
    <Modal show={showModal} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>회원 검색 및 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body className="search-student-container">
        <Form>
          <Form.Group>
            <Form.Label className="search-student-label">회원 검색</Form.Label>
            <Form.Control
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="닉네임 입력"
              className="search-student-input"
            />
          </Form.Group>

          {error && (
            <Alert variant="danger" className="search-student-alert">
              {error}
            </Alert>
          )}

          {searchResults.length > 0 && (
            <ListGroup className="search-student-list">
              {searchResults.map((student) => (
                <ListGroup.Item
                  key={student.id}
                  className="search-student-item"
                >
                  <span className="search-student-name">
                    {student.nickname}
                  </span>
                  <Button
                    className="search-student-add-btn"
                    onClick={() => setSelectedStudent(student)}
                  >
                    추가하기
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {selectedStudent && (
            <Form.Group className="search-student-times">
              <Form.Label className="search-student-times-label">
                횟수 입력
              </Form.Label>
              <Form.Control
                type="number"
                value={times}
                onChange={(e) => setTimes(parseInt(e.target.value) || 1)}
                min="1"
                className="search-student-times-input"
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          className="search-student-close-btn"
        >
          닫기
        </Button>
        <Button
          variant="primary"
          onClick={handleRegisterStudent}
          disabled={!selectedStudent}
          className="search-student-register-btn"
        >
          등록
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchStudentItem;
