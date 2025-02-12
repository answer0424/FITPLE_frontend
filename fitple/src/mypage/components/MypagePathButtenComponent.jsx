import React, { useContext, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import "../static/css/MyPagePathButtonStyle.css";
import { Link } from "react-router-dom";

const MypagePathButtenComponent = ({ onClick }) => {
  const [active, setActive] = useState(null);
  const { authority } = useContext(LoginContext);

  const handleClick = (type) => {
    setActive(type);
    onClick(type);
  };
  return (
    <div className="mypage-button-container d-flex flex-column justify-content-center align-items-center">
      <ButtonGroup className="mypage-button-group w-100 d-flex">
        <Button
          className={`mypage-button w-100 ${active === "a" ? "active" : ""}`}
          onClick={() => handleClick("a")}
        >
          Calendar
        </Button>
        <Button
          className={`mypage-button w-100 ${active === "b" ? "active" : ""}`}
          onClick={() => handleClick("b")}
        >
          {authority.isTrainer ? "Schedule Registration" : "couponPage"}
        </Button>
      </ButtonGroup>

      {/* Add margin to separate the "Home" link from the button group */}
      <Link to={"/"} className="btn mypage-button mt-3">HOME</Link>
    </div>
  );
  
};

export default MypagePathButtenComponent;
