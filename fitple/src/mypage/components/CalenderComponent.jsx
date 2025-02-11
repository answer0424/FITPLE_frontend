import React, { useContext, useEffect, useState, useCallback } from "react";
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

const CalenderComponent = ({ user }) => {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dailyEvents, setDailyEvents] = useState([]);
  const { events, updateEvents } = useEventContext();
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const { userInfo, authority } = useContext(LoginContext);

  // 📌 날짜 클릭 시 모달 열기
  const handleDayClick = (clickedDate) => {
    const formattedDate = moment(clickedDate).format("YYYY-MM-DD");

    let matchingReservations = events?.filter((event) =>
      event.date?.startsWith(formattedDate)
    );

    console.log("선택한 날짜의 일정:", matchingReservations);
    setSelectedDate(formattedDate);
    setDailyEvents(matchingReservations);
    setIsModalOpen(true);
  };

  // 📌 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setDailyEvents([]);
  };

  // 📌 캘린더의 날짜별 일정 표시
  const tileContent = useCallback(
    ({ date }) => {
      const formattedDate = moment(date).format("YYYY-MM-DD");

      let matchingReservations =
        selectedUser && Array.isArray(selectedStudent)
          ? selectedStudent.filter((event) =>
              event.date?.startsWith(formattedDate)
            )
          : events?.filter((event) => event.date?.startsWith(formattedDate)) ||
            [];

      return (
        <div className="event-info">
          {matchingReservations.length > 0 &&
            matchingReservations.map((event) => (
              <div key={event.reservationId} className="reservation-item">
                <span>{event.nickname}</span>
                <span>{event.date.slice(11, 16)}</span>
              </div>
            ))}
        </div>
      );
    },
    [events, selectedStudent]
  );

  // 📌 월 변경 감지
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentYear(activeStartDate.getFullYear());
    setCurrentMonth(activeStartDate.getMonth() + 1); // 여기서 보정된 값을 사용
  };

  // 📌 일정 데이터 가져오기
  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    api
      .get(`/member/${user.id}/calendar`, {
        params: { year: currentYear, month: currentMonth - 1 },
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(
          `캘린더 컴포넌트 ${currentYear}년 ${currentMonth}월 일정 로드: `,
          response.data
        );
        updateEvents(response.data);
        setTimeout(() => setDate(new Date()), 100); // ✅ 강제 리렌더링
      })
      .catch((error) => console.error("일정 불러오기 실패:", error));
  }, [currentYear, currentMonth]);

  return (
    <>
      <Container>
        {authority.isTrainer && (
          <TrainerStudentsDropdown
            trainerId={user.id}
            updateEvents={updateEvents}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setSelectedStudent={setSelectedStudent}
            year={currentYear}
            month={currentMonth}
            allowAllUsers={true}
          />
        )}
        <Calendar
          value={date}
          onChange={setDate}
          onClickDay={handleDayClick}
          onActiveStartDateChange={handleActiveStartDateChange}
          // 중요: activeStartDate를 명시적으로 설정
          activeStartDate={new Date(currentYear, currentMonth - 1)}
          calendarType="gregory"
          showNeighboringMonth={false}
          tileContent={tileContent}
        />
      </Container>

      <DailyScheduleModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedDate={selectedDate}
        dailyEvents={dailyEvents}
        user={user}
        tileContent={tileContent}
        selectedUser={selectedUser}
      />
    </>
  );
};

export default CalenderComponent;
