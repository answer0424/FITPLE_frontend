import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TrainerProfile from "../components/TrainerProfile";
import TrainerCertifications from "../components/TrainerCertifications";
import TrainerReviews from "../components/TrainerReviews";

function TrainerDetailPage() {
    const { trainerId } = useParams();
    const [trainer, setTrainer] = useState(null);
    const [reviews, setReviews] = useState([]);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (!trainerId) return;

        console.log(`🔄 트레이너(${trainerId}) 데이터 로딩 중...`);

        // 트레이너 상세 정보 가져오기
        fetch(`${BASE_URL}/quiz/trainers/${trainerId}/detail`)
            .then((res) => res.json())
            .then((data) => {
                console.log("✅ 트레이너 데이터 로드 성공:", data);
                console.log("📌 트레이너 상세 데이터:");
                console.table(data); // ✅ 트레이너 데이터 콘솔에 테이블 형식 출력
                setTrainer(data);
            })
            .catch((error) => console.error("❌ 트레이너 데이터 불러오기 실패:", error));

        // 트레이너 리뷰 가져오기
        fetch(`${BASE_URL}/api/reviews/training/${trainerId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("✅ 리뷰 데이터 로드 성공:", data);
                console.log("📌 리뷰 목록:");
                console.table(data); // ✅ 리뷰 데이터를 테이블 형식으로 출력
                setReviews(data);
            })
            .catch((error) => console.error("❌ 리뷰 데이터 불러오기 실패:", error));
    }, [trainerId]);

    if (!trainer) return <p>로딩 중...</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        
            <TrainerProfile trainer={trainer} />

         
            <TrainerCertifications certifications={trainer.certifications} BASE_URL={BASE_URL} />

          
            <TrainerReviews reviews={reviews} BASE_URL={BASE_URL} />
        </div>
    );
}

export default TrainerDetailPage;
