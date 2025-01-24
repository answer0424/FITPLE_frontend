import React, { useState, useEffect } from "react";
import axios from "axios";

function HBTIList() {
  const [hbtiData, setHbtiData] = useState([]); // 데이터를 담을 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // .env에서 API URL 가져오기

  useEffect(() => {
    // API 호출
    axios
      .get(`${apiBaseUrl}/hbti/data`) // Base URL 사용
      .then((response) => {
        // JSON 데이터를 배열로 변환
        const data = Object.entries(response.data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setHbtiData(data); // 데이터 저장
        setLoading(false); // 로딩 상태 변경
      })
      .catch((error) => {
        console.error("데이터 로드 실패:", error);
        setLoading(false); // 로딩 상태 변경
      });
  }, [apiBaseUrl]);

  // 로딩 화면 표시
  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  return (
    <div className="hbti-list">
      {hbtiData.map((item) => (
        <div key={item.id} className="hbti-item">
          <img src={item.dogImage} alt={item.label} />
          <h3>{item.label}</h3>
          <p>{item.shortDescription}</p>
        </div>
      ))}
    </div>
  );
}

export default HBTIList;
