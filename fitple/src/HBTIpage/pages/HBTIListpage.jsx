import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../common/component/Header"; // Header.jsx의 경로
import "../component/css/HBTIListpage.css"; // HBTIListpage 전용 CSS 경로
function HBTIListpage() {
  const [hbtiData, setHbtiData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/hbti/data`)
      .then((response) => {
        console.log("Fetched Data (원본):", response.data); // 원본 데이터 출력
        const formattedData = Object.entries(response.data).map(([key, value]) => ({
          hbti: key, // key를 hbti로 추가
          ...value,  // 나머지 데이터를 그대로 포함
        }));
        console.log("Formatted Data:", formattedData); // 변환된 데이터 확인
        setHbtiData(formattedData); // 변환된 데이터를 상태에 저장
        setLoading(false); // 로딩 상태 변경
      })
      .catch((error) => {
        console.error("데이터 로드 실패:", error); // 에러 처리
        setLoading(false);
      });
  }, []);
  

  if (loading) {
    return <div className="text-center mt-5">데이터를 불러오는 중...</div>;
  }

  return (
    <>
      <Header /> {/* Header 컴포넌트를 페이지 상단에 추가 */}
      <div className="container my-5">
        <h1 className="text-center mb-4">HBTI 리스트 페이지</h1>
        <div className="row g-4">
          {hbtiData.map((item) => (
            <div key={item.hbti} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${item.dogImage}`}
                  className="card-img-top"
                  alt={item.label}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.label} ({item.hbti})</h5>
                  <p className="card-text">{item.shortDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  
  
}

export default HBTIListpage;
