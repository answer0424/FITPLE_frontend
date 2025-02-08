import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import HBTIResultDisplay from "../../quizpage/components/quiz_common/HbtiResultDisplay";

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (!hbtiDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">HBTI 데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="quiz-result-container min-h-screen py-12 px-4">
      <div className="result-content-box max-w-7xl mx-auto rounded-2xl overflow-hidden">
        <div className="panel-layout flex relative min-h-[600px]">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-[#FAFAFA] opacity-20"></div>
          
          <div className="relative z-10 w-1/3 p-8">
            <div className="hbtiResult pl-12 pt-2">
              <HBTIResultDisplay 
                hbtiData={{ 
                  hbtiType: hbtiDetail.hbtiType,
                  dogImage: hbtiDetail.dogImage
                }}
              />
            </div>
          </div>

          <div className="relative z-10 w-2/3 p-8">
            <div className="description-section">
              <h2 className="text-2xl font-bold mb-6 text-white">{hbtiDetail.label}</h2>
              <p className="text-lg leading-relaxed text-white">{hbtiDetail.fullDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HBTIListDetailPage;