import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 요소 등록
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

const RegisterUserLine = ({ chatUsers, chatTrainers }) => {
  const [chartData, setChartData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (chatUsers.length === 0 && chatTrainers.length === 0) {
      return;
    }

    const allUsers = [...chatUsers, ...chatTrainers];

    // 해당 월의 전체 날짜 생성 (1일부터 말일까지)
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const dateCounts = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDate = `${currentYear}-${String(currentMonth).padStart(
        2,
        "0"
      )}-${String(i).padStart(2, "0")}`;
      dateCounts[formattedDate] = 0;
    }

    // 실제 회원가입 데이터 반영
    allUsers.forEach((user) => {
      const date = user.createdAt.split(" ")[0]; // "YYYY-MM-DD" 형식
      if (dateCounts.hasOwnProperty(date)) {
        dateCounts[date] += 1;
      }
    });

    // Chart.js 데이터 형식에 맞게 변환
    const labels = Object.keys(dateCounts);
    const data = Object.values(dateCounts);

    setChartData({
      labels,
      datasets: [
        {
          label: "일별 회원가입 수",
          data,
          borderColor: "#A1D0FC",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
        },
      ],
    });
  }, [chatUsers, chatTrainers, currentMonth, currentYear]);

  // 이전 달로 이동
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  // 다음 달로 이동 (12월에서 1월로 바뀔 때 연도 증가)
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  // 현재 월 이후로 이동 불가
  const isNextDisabled = () => {
    const today = new Date();
    return (
      currentYear > today.getFullYear() ||
      (currentYear === today.getFullYear() &&
        currentMonth >= today.getMonth() + 1)
    );
  };

  return (
    <div>
      <h3>
        일별 회원가입 수 ({currentYear}년 {currentMonth}월)
      </h3>
      <div>
        <button onClick={handlePrevMonth}>{"< 이전 달"}</button>
        <button onClick={handleNextMonth} disabled={isNextDisabled()}>
          {"다음 달 >"}
        </button>
      </div>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true, // 🔥 Y축 최소값을 0으로 설정
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RegisterUserLine;
