import React from "react";
import "../components/css/TrainerHome.css";

function TrainerHome({ content, galleryImages, gymName, gymAddress, gymLatitude, gymLongitude }) {
    return (
        <div className="trainer-home">
            <div className="trainer-intro">
                <h4>소개</h4>
                <p>{content || "트레이너 소개가 없습니다."}</p>
            </div>

            <div className="trainer-location">
                <h4>위치</h4>
                <p>
                    <strong>헬스장:</strong> {gymName || "정보 없음"}
                </p>
                <p>
                    <strong>주소:</strong> {gymAddress || "정보 없음"}
                </p>
                <div className="map-container">
                    {gymLatitude && gymLongitude ? (
                        <iframe
                            title="헬스장 위치"
                            src={`https://www.google.com/maps?q=${gymLatitude},${gymLongitude}&z=15&output=embed`}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    ) : (
                        <p>위치 정보가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TrainerHome;
