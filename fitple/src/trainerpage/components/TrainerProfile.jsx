import React from "react";

function TrainerProfile({ trainer }) {
    return (
        <div>
            <h2>{trainer.trainerName}님의 프로필</h2>
            <p><strong>이메일:</strong> {trainer.trainerEmail}</p>
            <p><strong>1회 수업 가격:</strong> {trainer.perPrice}원</p>
            <p><strong>본문:</strong> {trainer.content}</p>
            <p><strong>경력 시작:</strong> {new Date(trainer.career).toLocaleDateString()}</p>
            <p><strong>승인 상태:</strong> {trainer.isAccess}</p>

            <h3>트레이너 추가 정보</h3>
            <p><strong>HBTI:</strong> {trainer.hbti}</p>

            <h3>체육관 정보</h3>
            <p><strong>체육관:</strong> {trainer.gymName || "정보 없음"}</p>
            <p><strong>위치:</strong> {trainer.gymAddress || "위치 정보 없음"}</p>
        </div>
    );
}

export default TrainerProfile;
