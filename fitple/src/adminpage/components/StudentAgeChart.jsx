import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// 필요한 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const StudentAgeChart = ({ chatUsers }) => {
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

  useEffect(() => {
    // 데이터가 없으면 "데이터가 없습니다"를 출력
    if (chatUsers.length === 0) {
      setChartData({});
      setIsLoading(false); // 데이터가 없으면 로딩 완료 상태로 변경
      return;
    }

    // 연령대별로 사용자 그룹화
    const ageRanges = {
      "10대": 0,
      "20대": 0,
      "30대": 0,
      "40대": 0,
      "50대 이상": 0,
    };

    chatUsers.forEach((chatUser) => {
      const birthDate = new Date(chatUser.birth);
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthDate.getFullYear();

      if (age < 20) {
        ageRanges["10대"] += 1;
      } else if (age < 30) {
        ageRanges["20대"] += 1;
      } else if (age < 40) {
        ageRanges["30대"] += 1;
      } else if (age < 50) {
        ageRanges["40대"] += 1;
      } else {
        ageRanges["50대 이상"] += 1;
      }
    });

    // Chart.js 데이터 형식에 맞게 변환
    const data = {
      labels: Object.keys(ageRanges),
      datasets: [
        {
          data: Object.values(ageRanges),
          backgroundColor: [
            "#A1D0FC", // 밝은 파랑
            "#8BB9E6", // 조금 어두운 파랑
            "#6D9DCE", // 중간 파랑
            "#4F81B6", // 어두운 파랑
            "#33669E", // 가장 어두운 파랑
          ],
        },
      ],
    };

    setChartData(data);
    setIsLoading(false); // 데이터가 처리되면 로딩 완료 상태로 변경
  }, [chatUsers]);

  return (
    <div>
      <h3>연령대별 회원 분포</h3>
      {isLoading ? (
        <p>Loading chart...</p>
      ) : chatUsers.length === 0 ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <div style={{width: '600px', height: '600px'}}>
        <Pie 
        data={chartData}
         />
        </div>
      )}
    </div>
  );
};

export default StudentAgeChart;
