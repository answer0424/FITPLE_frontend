import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import "../static/css/MyPagePathButtonStyle.css";

const MypagePathButtenComponent = ({ onClick }) => {
  const [active, setActive] = useState(null);

  const handleClick = (type) => {
    setActive(type);
    onClick(type);
  };

  return (
    <div className="mypage-button-container">
      {/* <span className="mypage-label">monthly</span> */}
      <ButtonGroup className="mypage-button-group">
        <Button
          className={`mypage-button ${active === "a" ? "active" : ""}`}
          onClick={() => handleClick("a")}
        >
          Calendar
        </Button>
        <Button
          className={`mypage-button ${active === "b" ? "active" : ""}`}
          onClick={() => handleClick("b")}
        >
          Schedule Registration
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default MypagePathButtenComponent;
