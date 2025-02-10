import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import "../static/css/CalenderStyle.css";
import { Container } from "react-bootstrap";
import DailyScheduleModal from "../modal/DailyScheduleModal";
import { useEventContext } from "../context/EventContext";
import api from "../../mainpage/apis/api";
import TrainerStudentsDropdown from "../items/TrainerStudentsDropdown";
import "../static/css/ModalReset.css";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";

const CalenderComponent = ({user}) => {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dailyEvents, setDailyEvents] = useState([]); //오늘 일정 리스트
  const { events, updateEvents } = useEventContext(); //이 달의 일정
  const [ selectedStudent, setSelectedStudent ] = useState([]); //회원별 일정
  const { userInfo, authority } = useContext(LoginContext);

  //달력 제어
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleDayClick = (clickedDate) => {
    const formattedDate = moment(clickedDate).format("YYYY-MM-DD");
    const selectedDay = formattedDate.slice(8, 10);

    console.log(selectedDay);

    if (events) {
      setDailyEvents(
        events.filter((event) => {
          if (
            event.date &&
            typeof event.date === "string" &&
            event.date.length >= 10
          ) {
            const eventDay = event.date.slice(8, 10);
            // console.log(eventDay);
            return eventDay === selectedDay;
          }
          return false;
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
    if (!events || !Array.isArray(events)) {
      console.error("Events data is not loaded properly.");
      return []; // 데이터를 반환하지 않고 빈 배열로 처리
    }

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
  // <TrainerStudentsDropdown
  //   trainerId={user.id}
  //   updateEvents={updateEvents}
  //   year={date.getFullYear()}
  //   month={date.getMonth()}
  // />;

  const tileContent = ({ date }) => {
    const formattedDate = date.toISOString().split('T')[0];

    // 해당 날짜에 맞는 예약 찾기
    const matchingReservations = events && Array.isArray(events)
  ? events.filter(
      (event) => event.date && event.date.split('T')[0] === formattedDate
    )
  : [];

    // 예약이 있으면 렌더링
    return (
      <div className="event-info">
        { (selectedStudent && selectedStudent.length > 0) ? (
          selectedStudent.map((event) => (
            <div key={event.reservationId} className="reservation-item">
              <span>{event.nickname}</span>
              <span>{event.date.slice(11, 16)}</span>
            </div>
          )))
        : (matchingReservations && matchingReservations.length > 0 ? (
          matchingReservations.map((event) => (
            <div key={event.reservationId} className="reservation-item">
              <span>{event.nickname}</span>
              <span>{event.date.slice(11, 16)}</span>
            </div>
          ))) 
          : (
          <span></span>
        ))}
      </div>
    );
    
  };

  return (
    <>
      <Container>
        { authority.isTrainer ?
        <TrainerStudentsDropdown
          trainerId={user.id}
          updateEvents={setDailyEvents}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setSelectedStudent={setSelectedStudent}
        /> : (<div/>)
        }

        <Calendar
          value={date}
          onChange={handleDateChange}
          onClickDay={handleDayClick}
          calendarType="gregory"
          showNeighboringMonth={false}
          tileContent={tileContent}
        />
      </Container>

      {/* 일정 모달 */}
      <DailyScheduleModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedDate={selectedDate}
        dailyEvents={dailyEvents} // 전체 일정
        user={user} // 로그인된 사용자 정보
        selectedUser={selectedUser} // 선택한 학생 정보 추가
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
