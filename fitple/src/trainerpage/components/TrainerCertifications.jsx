import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/TrainerCertifications.css";

function TrainerCertifications({ certifications, BASE_URL }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleItemClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const fixedIconPath = "/icons/certificate-icon.png"; // 고정된 아이콘 경로

    return (
        <div className="certifications-container">
            <h3 className="text-center mb-4">검증된 자격 사항</h3>
            <ul className="certifications-list">
                {certifications.map((cert, index) => (
                    <li
                        key={index}
                        className="certification-item"
                        onClick={() => handleItemClick(cert.imageUrl)} // 리스트 아이템 클릭 핸들러
                    >
                        <img
                            src={fixedIconPath}
                            alt="자격증 아이콘"
                            className="certification-icon"
                        />
                        <span className="certification-skill">{cert.skills}</span>
                    </li>
                ))}
            </ul>

            {selectedImage && (
    <div className="modal-overlay" onClick={closeModal}>
        <div
            className="modal-contents"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 방지
        >
            {/* 이미지 */}
            <img
                src={`${BASE_URL}${selectedImage}`}
                alt="자격증 사진"
                className="modal-images"
            />

            {/* 닫기 버튼 */}
            <button
                className="close-button"
                onClick={closeModal}
            >
                닫기
            </button>
        </div>
    </div>
)}
        </div>
    );
}

export default TrainerCertifications;
