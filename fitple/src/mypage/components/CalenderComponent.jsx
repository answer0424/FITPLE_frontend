import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "../static/css/CalenderStyle.css";
import { Container } from "react-bootstrap";
import axios from "axios";
import DailyScheduleModal from "../modal/DailyScheduleModal";
import { useEventContext } from "../context/EventContext";
import api from "../../mainpage/apis/api";

const CalenderComponent = ({ user }) => {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [dailyEvents, setDailyEvents] = useState([]); //오늘 일정 리스트
  const { events, updateEvents } = useEventContext(); //이 달의 일정

  //달력 제어
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleDayClick = (clickedDate) => {
    const formattedDate = moment(clickedDate).format("YYYY-MM-DD");
    const selectedDay = formattedDate.slice(8, 10);

    if (events) {
      setDailyEvents(
        events.filter((event) => {
          if (event.date) return event.date.slice(8, 10) === selectedDay;
        })
      );
    }
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };
  //달력 제어

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setDailyEvents([]);
  };

  // const toggleCompletion = (index) => {
  //   setEvent((prev) =>
  //     prev.map((event, i) =>
  //       i === index ? { ...event, isCompleted: !event.isCompleted } : event
  //     )
  //   );
  // };

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
    api
      .get(`/member/${user.id}/calendar`, {
        params: {
          year: date.getFullYear(),
          month: date.getMonth(),
        },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // console.log(response.headers['content-type']);
        // console.log(response.data);
        console.log("일정입니다 : ", response.data);
        updateEvents(response.data);
      });
  }, []);

  // useEffect(() => {
  //   // console.log("컨텍스트 사용")
  //   // console.log(events);
  // }, [events])

  return (
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
                    <div
                      key={index}
                      className={`event-item ${
                        event.isCompleted ? "completed" : ""
                      }`}
                    >
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

      {/* 일정 모달 */}
      <DailyScheduleModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedDate={selectedDate}
        dailyEvents={dailyEvents}
        user={user}
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
