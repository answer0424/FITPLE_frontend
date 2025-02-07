import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled, { withTheme } from "styled-components";
import moment from "moment";
// import "./Calendar.css";
// import Profile from "./profile";
import '../static/css/CalenderStyle.css';
import { Modal, Button, Form, Container } from "react-bootstrap";


const CalenderComponent = ({user}) => {

  const today = new Date();
  const [date, setDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]); // 일정 데이터를 저장하는 상태
  const [eventInput, setEventInput] = useState(""); // 일정 제목 입력 상태
  const [timeInput, setTimeInput] = useState(""); // 일정 시간 입력 상태
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([
    { name: "John Doe", completed: false },
    { name: "Jane Smith", completed: true },
  ]); // 회원 리스트 샘플 데이터

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleDayClick = (clickedDate) => {
    setSelectedDate(moment(clickedDate).format("YYYY-MM-DD"));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEventInput("");
    setTimeInput("");
  };

  const addEvent = () => {
    if (!eventInput.trim() || !timeInput.trim()) return;
    setEvents((prev) => [
      ...prev,
      {
        date: selectedDate,
        time: timeInput,
        title: eventInput.trim(),
        isCompleted: false,
        member: selectedMember,
      },
    ]);
    closeModal();
  };

  const toggleCompletion = (index) => {
    setEvents((prev) =>
      prev.map((event, i) =>
        i === index ? { ...event, isCompleted: !event.isCompleted } : event
      )
    );
  };

  const getEventsForDate = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return events.filter((event) => event.date === formattedDate);
  };

  
  return  (
    <>
      <Container>
        <Calendar
          value={date}
          onChange={handleDateChange}
          onClickDay={handleDayClick}
          formatDay={(locale, date) => moment(date).format("D")}
          formatYear={(locale, date) => moment(date).format("YYYY")}
          formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
          calendarType="gregory"
          showNeighboringMonth={false}
          tileContent={({ date, view }) => {
            if (view === "month") {
              const eventsForDay = getEventsForDate(date);
              return (
                <>
                  {eventsForDay.map((event, index) => (
                    <div key={index} className={`event-item ${event.isCompleted ? "completed" : ""}`}>
                      {event.time} {event.title}
                    </div>
                  ))}
                </>
              );
            }
            return null;
          }}
        />
      </Container>

      {/* 일정 추가 모달 */}
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

      {/* 일정 리스트 보기 */}
      {/* <EventList>
        {members.map((member, index) => (
          <EventItem key={index}>
            <span>{member.name}</span>
            <span>{member.completed ? "완료" : "미완료"}</span>
          </EventItem>
        ))}
      </EventList> */}
    </>
  );
};

export default CalenderComponent;
