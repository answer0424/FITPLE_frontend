import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const HbtiTypeChart = ({ chatUsers, chatTrainers }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (chatUsers.length === 0 && chatTrainers.length === 0) {
      console.log("데이터 없음");
      return;
    }

    console.log("데이터 있음");
    
    // HBTI 타입 목록
    const hbtiTypes = [
      "MICP", "MECP", "BICP", "BECP", "MICG", "MECG", "BICG", "BECG",
      "MINP", "MENP", "BINP", "BENP", "MING", "MENG", "BING", "BENG"
    ];

    // 모든 사용자 데이터 합치기
    const allUsers = [...chatUsers, ...chatTrainers];

    // HBTI 값 개수 세기
const hbtiCounts = allUsers.reduce((acc, user) => {
    const hbtiValue = user.hbti?.hbti ?? null; // null 방지
    console.log("유저 hbti:", hbtiValue);
  
    if (hbtiValue && hbtiTypes.includes(hbtiValue)) {
      acc[hbtiValue] = (acc[hbtiValue] || 0) + 1;
    }
  
    return acc;
  }, {});
  

    console.log("HBTI 개수:", hbtiCounts);

    // 차트 데이터 변환
    const labels = Object.keys(hbtiCounts);
    const data = Object.values(hbtiCounts);

    setChartData({
      labels,
      datasets: [
        {
          label: "HBTI 분포",
          data,
          backgroundColor: [
            "#A1D0FC", "#91C0EC", "#81B0DC", "#71A0CC", "#6190BC", 
            "#5180AC", "#41709C", "#31608C", "#21507C", "#11406C",
            "#00305C", "#002050", "#001840", "#001030", "#000820", "#000410"
          ],
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    });
  }, [chatUsers, chatTrainers]);

  return (
    <div>
      <h3>HBTI 분포도</h3>
      {chartData ? 
      <div style={{width: '60%', height: '60%'}}>
        <Pie 
        data={chartData} 
        options={{responsive: true}}
        />
      </div>
       : <p>Loading...</p>}
    </div>
  );
};

export default HbtiTypeChart;
