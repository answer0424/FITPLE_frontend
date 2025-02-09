import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import "../static/css/StudentsList.css";
import SearchStudentItem from "../items/SerchStudentItem";

const StudentsList = ({ user }) => {
  const [studentList, setStudentList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newTimes, setNewTimes] = useState(0);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const observer = useRef();

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:8081/member/${user.id}/register`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.status === 200 && response.data.length > 0) {
          setStudentList(response.data);
          setDisplayList(response.data.slice(0, visibleCount));
        } else {
          setStudentList([]);
          setDisplayList([]);
          setError("학생 목록을 불러올 수 없습니다.");
        }
      } catch (error) {
        setError("학생 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  const lastStudentRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          displayList.length < studentList.length
        ) {
          setTimeout(() => {
            setVisibleCount((prev) => prev + 8);
            setDisplayList(studentList.slice(0, visibleCount + 8));
          }, 500);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, displayList, studentList, visibleCount]
  );

  const handleCardClick = (student) => {
    setSelectedStudent(student);
    setNewTimes(student.times);
    setShowModal(true);
  };

  const handleUpdateTimes = async () => {
    if (!selectedStudent) return;

    try {
      await axios.patch(
        "http://localhost:8081/pt-count",
        {
          studentId: selectedStudent.userId,
          trainerId: user.id,
          times: newTimes,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setStudentList((prev) =>
        prev.map((s) =>
          s.userId === selectedStudent.userId ? { ...s, times: newTimes } : s
        )
      );
      setShowModal(false);
    } catch (error) {
      alert("횟수 변경 중 오류 발생");
    }
  };

  const addMember = (studentId, nickname, times) => {
    if (studentList.some((student) => student.userId === studentId)) {
      alert("이미 존재하는 회원입니다.");
      return;
    }
    const newStudent = { userId: studentId, nickname, times };
    setStudentList((prev) => [...prev, newStudent]);
    setDisplayList((prev) => [...prev, newStudent]);
  };

  return (
    <div className="students-container">
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup className="students-list">
        {displayList.length > 0 ? (
          displayList.map((student, index) => (
            <Card
              key={student.userId}
              className="student-card"
              ref={index === displayList.length - 1 ? lastStudentRef : null}
              onClick={() => handleCardClick(student)}
            >
              <div className="student-info">
                <img
                  src={`${import.meta.env.VITE_Server}/${student.profileImage}`}
                  alt="profile"
                  className="profile-img"
                />
                <div>
                  <h5>{student.nickname} 회원님</h5>
                  <p className="description"> 남은 횟수 : {student.times}</p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Alert variant="secondary" className="text-center">
            등록된 회원이 없습니다.
          </Alert>
        )}
      </ListGroup>
      {isLoading && <Spinner animation="border" />}

      <Button
        variant="dark"
        onClick={() => setShowRegisterModal(true)}
        style={{ width: "100px" }}
      >
        회원 등록
      </Button>

      {showRegisterModal && (
        <SearchStudentItem
          showModal={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          user={user}
          onRegister={addMember}
        />
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>PT 횟수 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                {selectedStudent?.nickname} 회원님의 남은 PT 횟수
              </Form.Label>
              <div className="d-flex align-items-center">
                <Button
                  variant="danger"
                  onClick={() => setNewTimes((prev) => Math.max(prev - 1, 0))}
                >
                  -1
                </Button>
                <Form.Control
                  type="number"
                  value={newTimes}
                  onChange={(e) => setNewTimes(Number(e.target.value))}
                  className="mx-2 text-center"
                />
                <Button
                  variant="success"
                  onClick={() => setNewTimes((prev) => prev + 1)}
                >
                  +1
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleUpdateTimes}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentsList;
