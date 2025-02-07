import React from 'react';

const HBTIResultDisplay = ({ hbtiData }) => {
  return (
    <>
      <h2 className="modal-text">나의 <span>HBTI</span>는</h2>
      <h1 className="modal-title">
        {hbtiData?.hbtiType?.split('').map((letter, index) => (
          <span key={index}>{letter}</span>
        ))}
      </h1>
      {hbtiData?.dogImage && (
        <img
          src={`${import.meta.env.VITE_Server}${hbtiData.dogImage}`}
          alt="HBTI Type"
          className="modal-image"
        />
      )}
      <h3 className="modal-subtitle">{hbtiData?.label}</h3>
    </>
  );
};

export default HBTIResultDisplay;