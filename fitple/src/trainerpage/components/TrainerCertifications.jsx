import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/TrainerCertifications.css";

function TrainerCertifications({ certifications, BASE_URL }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    // 고정된 아이콘 경로 (public 폴더 기반 경로)
    const fixedIconPath = "/icons/certificate-icon.png";

    return (
        <div>
            <h3 className="text-center mb-4">검증된 자격 사항</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {certifications.map((cert, index) => (
                    <li
                        key={index}
                        className="d-flex align-items-center mb-3 bg-dark text-light p-2 rounded"
                    >
                        <img
                            src={fixedIconPath} // 고정된 아이콘 경로
                            alt="자격증 아이콘"
                            style={{
                                width: "50px",
                                height: "50px",
                                marginRight: "15px",
                                objectFit: "contain",
                            }}
                        />
                        <span className="flex-grow-1">{cert.skills}</span>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleImageClick(cert.imageUrl)}
                        >
                            사진보기
                        </button>
                    </li>
                ))}
            </ul>

            {/* 모달 */}
            {selectedImage && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    onClick={closeModal}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">자격증 사진</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <img
                                    src={`${BASE_URL}${selectedImage}`}
                                    alt="자격증 사진"
                                    className="img-fluid rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TrainerCertifications;
