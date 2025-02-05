import React from 'react';
import { Modal, Button, Form } from "react-bootstrap";

const RegisterSceduleModal = ({ isModalOpen, closeModal, addEvent, selectedDate, timeInput, setTimeInput }) => {

    // const [eventInput, setEventInput] = useState(""); // 일정 제목 입력 상태
    // const [timeInput, setTimeInput] = useState(""); // 일정 시간 입력 상태

    return (
      <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>일정 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>선택된 날짜: {selectedDate}</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>일정 제목</Form.Label>
              <Form.Control
                type="text"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                placeholder="일정 제목을 입력하세요"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>시간</Form.Label>
              <Form.Control
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            닫기
          </Button>
          <Button variant="primary" onClick={addEvent}>
            추가
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

export default RegisterSceduleModal;