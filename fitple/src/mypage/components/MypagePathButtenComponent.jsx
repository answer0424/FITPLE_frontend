import React, { useContext, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import "../static/css/MyPagePathButtonStyle.css";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";

const MypagePathButtenComponent = ({ onClick }) => {
  const [active, setActive] = useState(null);
  const { userInfo } = useContext(LoginContext);

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
          {userInfo.isTrainer ? "Schedule Registration" : "couponPage"}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default MypagePathButtenComponent;
