import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function HBTIListDetailPage() {
  const [searchParams] = useSearchParams(); 
  const hbtiType = searchParams.get("type"); 
  const [hbtiDetail, setHbtiDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_Server}/api/hbti/type/${hbtiType}`) 
      
      .then((response) => {
        setHbtiDetail(response.data);
        setLoading(false);
        console.log("데이터 로드 성공");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("데이터 로드 실패:", error);
        setLoading(false);
      });
  }, [hbtiType]);

  if (loading) {
    return <div className="text-center mt-5">데이터를 불러오는 중...</div>;
  }

  if (!hbtiDetail) {
    return <div className="text-center mt-5">HBTI 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container my-5">
      <h1>{hbtiDetail.label}</h1>
      <p>{hbtiDetail.description}</p>
      <img
        src={`${import.meta.env.VITE_API_BASE_URL}${hbtiDetail.image}`}
        alt={hbtiDetail.label}
      />
    </div>
  );
}

export default HBTIListDetailPage;
