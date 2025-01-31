import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../common/component/Header";
import { useNavigate } from "react-router-dom";
import "../component/css/HBTIListpage.css";

// HBTI 유형에 따른 그룹 분류 함수
const getGroup = (hbti) => {
  if (["MICP", "MECP", "BICP", "BECP"].includes(hbti)) return "solo";
  if (["MICG", "MECG", "BICG", "BECG"].includes(hbti)) return "active";
  if (["MINP", "MENP", "BINP", "BENP"].includes(hbti)) return "strength";
  if (["MING", "MENG", "BING", "BENG"].includes(hbti)) return "group";
  return "default";
};

// 데이터를 그룹화하는 함수
const groupByType = (data) => {
  const groupedData = {
    solo: [],
    active: [],
    strength: [],
    group: [],
  };

  data.forEach((item) => {
    const group = getGroup(item.hbti);
    groupedData[group].push(item);
  });

  return groupedData;
};

// ColorfulText 컴포넌트: 한 글자씩 색상을 다르게 적용
const ColorfulText = ({ text, colors }) => {
  return (
    <span>
      {text.split("").map((char, index) => (
        <span key={index} style={{ color: colors[index % colors.length] }}>
          {char}
        </span>
      ))}
    </span>
  );
};

function HBTIListPage() {
  const [hbtiData, setHbtiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/hbti/data`)
      .then((response) => {
        const formattedData = Object.entries(response.data).map(([key, value]) => ({
          hbti: key,
          ...value,
        }));
        setHbtiData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("데이터 로드 실패:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-5">데이터를 불러오는 중...</div>;
  }

  // 그룹화된 데이터
  const groupedData = groupByType(hbtiData);

  // HBTI 색상 배열 (수정된 조합)
  const hbtiColors = ["#ed17f8", "#ed17f8", "#ed17f8", "#ed17f8", "#ed17f8", "#ed17f8"];

  // 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (hbtiType) => {
    navigate(`/hbti/detail?type=${hbtiType}`); // 쿼리 파라미터로 전달
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        {/* 페이지 제목 */}
        <h1 className="hbti-header">HBTI</h1>
        <h2 className="hbti-subtitle">(HEALTH BEHAVIOR TYPE INDICATOR)</h2>
        <h3 className="hbti-description">성격유형</h3>

        {/* 그룹별 섹션 */}
        {Object.entries(groupedData).map(([group, items]) => (
          <div key={group} className={`group-section ${group}`}>
            {/* 그룹 제목 */}
            <div className={`group-title ${group}`}>
              {group === "solo" && "솔로형"}
              {group === "active" && "산소형"}
              {group === "strength" && "근육형"}
              {group === "group" && "그룹형"}
            </div>

            {/* 카드 그룹 */}
            <div className="row justify-content-center g-4">
              {items.map((item) => (
                <div
                  key={item.hbti}
                  className="col-12 col-md-6 col-lg-3"
                  onClick={() => handleCardClick(item.hbti)} // 클릭 이벤트 추가
                  style={{ cursor: "pointer" }}
                >
                  <div className={`card h-100 shadow-sm card-${group}`}>
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${item.dogImage}`}
                      className="card-img-top"
                      alt={item.label}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.label}</h5>
                      <div className="card-hbti">
                        <ColorfulText text={item.hbti} colors={hbtiColors} />
                      </div>
                      <p className="card-text">{item.shortDescription}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default HBTIListPage;
