import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HBTIListpage.css";

function HBTIListpage() {
  const [hbtiData, setHbtiData] = useState([]); // HBTI 데이터를 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/hbti/data`
        );
        const data = Object.entries(response.data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        console.log("Fetched Data:", data); // 데이터를 콘솔에 출력
        setHbtiData(data); // 데이터 저장
        setLoading(false); // 로딩 상태 변경
        console.log("로드 성공");
      } catch (error) {
        console.error("데이터 로드 실패:", error); // 에러 처리
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>데이터를 불러오는 중...</div>; // 로딩 중 표시
  }

  return (
    <div className="hbti-list">
      <div>
        <h1>HBTI 리스트 페이지</h1>
      </div>
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

export default HBTIListpage;
