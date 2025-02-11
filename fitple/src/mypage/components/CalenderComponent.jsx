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

const CalenderComponent = ({ user }) => {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState("all");
  const [dailyEvents, setDailyEvents] = useState([]);
  const { events, updateEvents } = useEventContext();
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const { userInfo, authority } = useContext(LoginContext);


  // 📌 달력 날짜 선택
  const handleDayClick = (clickedDate) => {
    const formattedDate = moment(clickedDate).format("YYYY-MM-DD");
    
    let matchingReservations;

    if (selectedUser === "all") {
      console.log("handleDayClick 진입")
      // events가 배열인지 확인 후 필터링
      filteredReservations = Array.isArray(matchingReservations)
        ? events.filter((event) => event.date?.startsWith(formattedDate))
        : [];
    } else if (selectedStudent && Array.isArray(selectedStudent)) {
      matchingReservations = selectedStudent.filter((event) =>
        event.date?.startsWith(formattedDate)
      );
    } else {
      matchingReservations = [];
    }

    // setMatchingReservations(filteredReservations);
    setSelectedDate(formattedDate);
    setDailyEvents(matchingReservations);
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

    let matchingReservations;

    if (selectedUser === "all" && Array.isArray(matchingReservations)) {
      filteredReservations = matchingReservations.filter((event) =>
        event.date?.startsWith(formattedDate)
      );
    } else if (selectedStudent && Array.isArray(selectedStudent)) {
      matchingReservations = selectedStudent.filter((event) =>
        event.date?.startsWith(formattedDate)
      );
    } else {
      matchingReservations = [];
    }

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
  };

  // 📌 월 변경 감지 (월이 변경될 때마다 currentYear, currentMonth 업데이트)
  const handleActiveStartDateChange = ({ activeStartDate }) => {
    setCurrentYear(activeStartDate.getFullYear());
    setCurrentMonth(activeStartDate.getMonth() + 1);
  };

  // 📌 일정 데이터 가져오기 (연도 또는 월이 변경될 때만 실행)
  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    const fetchSchedules = async () => {
      try {
        const response = await api.get(`/member/${user.id}/calendar`, {
          params: {
            year: currentYear,
            month: currentMonth - 1,
          },
          withCredentials: true,
        });

        // console.log(
        //   `${currentYear}년 ${currentMonth}월 일정 로드: `,
        //   response.data
        // );
        //일정이 없을 경우
        if(response.data.length === 0) {
          setMatchingReservations([1, 2, 3]);
          alert("일정이 없네용")
        }
        // Context의 updateEvents 함수 사용
        updateEvents(response.data);
      })
      .catch((error) => {
        console.error("일정 불러오기 실패:", error);
        updateEvents([]); // 에러 시 빈 배열로 초기화
      }
    };

    fetchSchedules();
  }, [user?.id, currentYear, currentMonth]);

  // 📌 전체 회원 선택 시 전체 일정 불러오기
  useEffect(() => {
    if (selectedStudent === "all" && Array.isArray(events)) {
      setMatchingReservations(events)
    }
  }, [selectedStudent]);

  //불러온 이벤트 매칭예약에 옮기기
  useEffect(() => {
    // console.log("컨텍스트 적용")
    console.log(events);
    setMatchingReservations(events);
  }, [events])

  useEffect(() => {
    console.log(dailyEvents);
  }, [dailyEvents])

  useEffect(() => {
    console.log(matchingReservations);
  }, [matchingReservations])


  return (
    <>
      <Container>
        {authority.isTrainer ? (
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
        ) : (
          <div />
        )}

        {
        (matchingReservations && matchingReservations.length >= 0) &&
        <Calendar
          value={date}
          onChange={setDate}
          onClickDay={handleDayClick}
          onActiveStartDateChange={handleActiveStartDateChange} // ✅ 월 변경 감지 추가
          calendarType="gregory"
          showNeighboringMonth={false}
          tileContent={tileContent}
        />
        }
      </Container>

      {/* ✅ 모달: 선택한 날짜의 일정 표시 */}
      <DailyScheduleModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        setSelectedUser={setSelectedUser}
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
