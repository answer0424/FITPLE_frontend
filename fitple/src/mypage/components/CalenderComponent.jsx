import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { Container } from "react-bootstrap";
import DailyScheduleModal from "../modal/DailyScheduleModal";
import { useEventContext } from "../context/EventContext";
import api from "../../mainpage/apis/api";
import TrainerStudentsDropdown from "../items/TrainerStudentsDropdown";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";

import "react-calendar/dist/Calendar.css";
import "../static/css/CalenderStyle.css";
import "../static/css/ModalReset.css";
import "../static/css/EventItems.css";

const CalenderComponent = () => {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState("all");
  const [dailyEvents, setDailyEvents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [matchingReservations, setMatchingReservations] = useState([]);

  // EventContext에서 events와 updateEvents를 가져옵니다
  const { events, updateEvents, MonthUpdateEvents } = useEventContext();
  const { userInfo, authority } = useContext(LoginContext);

  // 📌 달력 날짜 선택
  const handleDayClick = (clickedDate) => {
    const formattedDate = moment(clickedDate).format("YYYY-MM-DD");
    let filteredReservations = [];

    if (selectedUser === "all") {
      console.log("handleDayClick 진입");
      // events가 배열인지 확인 후 필터링
      filteredReservations = Array.isArray(matchingReservations)
        ? events.filter((event) => event.date?.startsWith(formattedDate))
        : [];
    } else if (selectedStudent && Array.isArray(selectedStudent)) {
      filteredReservations = selectedStudent.filter((event) =>
        event.date?.startsWith(formattedDate)
      );
    }

    // setMatchingReservations(filteredReservations);
    setSelectedDate(formattedDate);
    setDailyEvents(filteredReservations);
    setIsModalOpen(true);
  };

  // 📌 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setDailyEvents([]);
    // setMatchingReservations([]);
  };

  // 📌 캘린더에 일정 표시
  const tileContent = ({ date }) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    let filteredReservations = [];

    if (selectedUser === "all" && Array.isArray(matchingReservations)) {
      filteredReservations = matchingReservations.filter((event) =>
        event.date?.startsWith(formattedDate)
      );
    } else if (selectedStudent && Array.isArray(selectedStudent)) {
      filteredReservations = selectedStudent.filter((event) =>
        event.date?.startsWith(formattedDate)
      );
    }

    return (
      <div className="event-info">
        {filteredReservations.slice(0, 2).map((event) => (
          <div
            key={event.reservationId}
            className="reservation-item event-color"
          >
            <span className="event-nickname">
              {event.nickname}
              {event.authority === "ROLE_TRAINER" ? " 트레이너" : " 회원"}
            </span>
          </div>
        ))}
        {filteredReservations.length > 2 && (
          <div className="reservation-item more-events">
            +{filteredReservations.length - 2}
          </div>
        )}
      </div>
    );
  };

  // 📌 월 변경 감지
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentYear(activeStartDate.getFullYear());
    setCurrentMonth(activeStartDate.getMonth() + 1);
  };

  // 📌 일정 데이터 가져오기
  useEffect(() => {
    console.log(userInfo.id);
    if (!userInfo.id) return;

    console.log("일정 가져오기" + userInfo.id);
    const fetchSchedules = async () => {
      try {
        const response = await api.get(`/member/${userInfo.id}/calendar`, {
          params: {
            year: currentYear,
            month: currentMonth - 1,
          },
          withCredentials: true,
        });

        console.log(
          `${currentYear}년 ${currentMonth}월 일정 로드: `,
          response.data
        );
        //일정이 없을 경우
        if (response.data.length === 0) {
          console.log("일정이 없슺니다");
        }
        // Context의 updateEvents 함수 사용
        if (events) updateEvents(response.data);
        else MonthUpdateEvents(response.data);
      } catch (error) {
        console.error("일정 불러오기 실패:", error);
        MonthUpdateEvents([]); // 에러 시 빈 배열로 초기화
      }
    };

    fetchSchedules();
  }, [currentYear, currentMonth]);

  // 📌 전체 회원 선택 시 전체 일정 불러오기
  useEffect(() => {
    if (selectedStudent === "all" && Array.isArray(events)) {
      setMatchingReservations(events);
    }
  }, [selectedStudent]);

  //불러온 이벤트 매칭예약에 옮기기
  useEffect(() => {
    console.log(events);
    setMatchingReservations(events);
  }, [events]);

  useEffect(() => {
    console.log(currentMonth);
  }, [currentMonth]);

  // useEffect(() => {
  //   console.log(matchingReservations);
  // }, [matchingReservations])

  return (
    <>
      <Container fluid className="p-0 vh-100">
        {authority.isTrainer ? (
          <TrainerStudentsDropdown
            trainerId={userInfo.id}
            updateEvents={updateEvents}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setSelectedStudent={setSelectedStudent}
            year={currentYear}
            month={currentMonth}
            allowAllUsers={true}
          />
        ) : (
          <div />
        )}

        {matchingReservations && matchingReservations.length >= 0 && (
          <div className="row h-100">
            <div className="col-12 d-flex justify-content-center align-items-center h-100">
              <Calendar
                value={date}
                onChange={setDate}
                onClickDay={handleDayClick}
                onActiveStartDateChange={handleActiveStartDateChange}
                calendarType="gregory"
                showNeighboringMonth={false}
                tileContent={tileContent}
                style={{ width: "100%", height: "100%" }}
                className="w-100 h-100"
              />
            </div>
          </div>
        )}
      </Container>

      <DailyScheduleModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        setSelectedUser={setSelectedUser}
        selectedDate={selectedDate}
        dailyEvents={dailyEvents}
        selectedUser={selectedUser} // 선택된 회원
      />
    </>
  );
};

export default CalenderComponent;
