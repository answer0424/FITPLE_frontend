import React, { useState } from "react";
import { Modal, Form, Button, ListGroup, Alert } from "react-bootstrap";
import axios from "axios";
import "../static/css/SerchStudentItem.css"; // CSS 파일 import

const SearchStudentItem = ({ showModal, onClose, user, onRegister }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [times, setTimes] = useState(1);
  const [error, setError] = useState(null);

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  const handleSearchStudents = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:8081/member/${user.id}/register/search`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        const filteredResults = response.data.filter((student) =>
          student.nickname.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
        setError("검색 결과가 없습니다.");
      }
    } catch (error) {
      setSearchResults([]);
      setError("학생 검색 중 오류가 발생했습니다.");
    }
  };

  const handleRegisterStudent = async () => {
    if (!selectedStudent) return;

    try {
      await axios.post(
        `http://localhost:8081/member/register/add-member`,
        { trainerId: user.id, studentId: selectedStudent.id, times },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("회원이 성공적으로 등록되었습니다.");
      onRegister(user.id, selectedStudent.id, times);
      onClose();
    } catch (error) {
      alert("회원 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal show={showModal} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>회원 검색 및 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body className="search-container">
        <Form>
          <Form.Group>
            <Form.Label>회원 검색</Form.Label>
            <Form.Control
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="닉네임 입력"
              className="search-input"
            />
            <Button className="search-btn mt-2" onClick={handleSearchStudents}>
              검색
            </Button>
          </Form.Group>

          {error && (
            <Alert variant="danger" className="alert-message">
              {error}
            </Alert>
          )}

          {searchResults.length > 0 && (
            <ListGroup className="mt-3">
              {searchResults.map((student) => (
                <ListGroup.Item
                  key={student.userId}
                  className="list-group-item"
                >
                  <span>{student.nickname}</span>
                  <Button
                    className="add-btn"
                    onClick={() => setSelectedStudent(student)}
                  >
                    추가하기
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {selectedStudent && (
            <Form.Group className="mt-3">
              <Form.Label>횟수 입력</Form.Label>
              <Form.Control
                type="number"
                value={times}
                onChange={(e) => setTimes(parseInt(e.target.value) || 1)}
                min="1"
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
        <Button
          variant="primary"
          onClick={handleRegisterStudent}
          disabled={!selectedStudent}
        >
          등록
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchStudentItem;
