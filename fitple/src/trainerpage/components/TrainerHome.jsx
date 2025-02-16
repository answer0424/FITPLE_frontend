import React from "react";
import "../static/css/TrainerHome.css";

function TrainerHome({
  content,
  galleryImages,
  gymName,
  gymAddress,
  gymLatitude,
  gymLongitude,
}) {
  const stripHtmlTags = (html) => {
    if (!html) return "트레이너 소개가 없습니다.";
    return html.replace(/<\/?[\w\s="/.':;#-\/\?]+>/gi, "").trim();
  };

  return (
    <div className="trainer-home">
      <div className="trainer-intro">
        <h4 className="soga-title kr-font">소개</h4>
        <p
          className="soga-content kr-font"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="trainer-location">
        <h4 className="location-title kr-font">위치</h4>

        <div className="location-info">
          <p className="gym-name kr-font">
            <span className="label">🏋 헬스장:</span>{" "}
            <span className="value">{gymName || "정보 없음"}</span>
          </p>
          <p className="gym-address kr-font">
            <span className="label">📍 주소:</span>{" "}
            <span className="value">{gymAddress || "정보 없음"}</span>
          </p>
        </div>

        <div className="map-container">
          {gymLatitude && gymLongitude ? (
            <iframe
              title="헬스장 위치"
              src={`https://www.google.com/maps?q=${gymLatitude},${gymLongitude}&z=15&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          ) : (
            <p className="no-location">위치 정보가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrainerHome;
