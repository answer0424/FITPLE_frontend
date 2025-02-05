import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import '../static/css/CalenderStyle.css';
import { Container } from "react-bootstrap";
import axios from "axios";
import DailyScheduleModal from "../modal/DailyScheduleModal";


const CalenderComponent = ({user}) => {

  const today = new Date();
  const [date, setDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]); // 일정 데이터를 저장하는 상태
  const [dailyEvents, setDailyEvents] = useState([])

  //달력 제어
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleDayClick = (clickedDate) => {

    const formattedDate = moment(clickedDate).format("YYYY-MM-DD");
    const selectedDay = formattedDate.slice(8, 10);

    setSelectedDate(formattedDate);
    setDailyEvents(events.filter(event => event.date.slice(8, 10) === selectedDay));
    setIsModalOpen(true);
  };
  //달력 제어

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setDailyEvents([]);
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

  useEffect(() => {
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
    //일정 불러오기
    axios.get(`${import.meta.env.VITE_Server}/member/${user.id}/calendar`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        year: date.getFullYear(),
        month: date.getMonth(),
      }
    })
    .then((response) => {
      // console.log(response.headers['content-type']);
      console.log(response.data);
      setEvents(response.data);
    })
  }, []);

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
      <DailyScheduleModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addEvent={addEvent}
        selectedDate={selectedDate}
        dailyEvents={dailyEvents}
      />

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
