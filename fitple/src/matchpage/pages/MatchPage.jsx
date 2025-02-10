import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TrainerMatchList from "../components/TrainerMatchList";
import Header from "../../common/component/Header";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MatchPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { authority, userInfo } = useContext(LoginContext);
  const SwalWithReact = withReactContent(Swal);

  // SweetAlert를 공통으로 처리하는 함수
  const showAlertAndRedirect = (title, text, redirectPath) => {
    SwalWithReact.fire({
      icon: "error",
      title,
      text,
      confirmButtonText: "확인",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      navigate(redirectPath);
    });
  };

  // 권한 확인
  useEffect(() => {
    if (authority?.isTrainer) {
      showAlertAndRedirect(
        "권한이 없습니다",
        "매칭 페이지에 접근할 수 없습니다.",
        "/"
      );
    }
  }, [authority]);

  // HBTI 데이터 확인
  useEffect(() => {
    if (!userInfo?.hbti) {
      showAlertAndRedirect(
        "HBTI 데이터가 없습니다.",
        "HBTI 테스트를 진행해주세요.",
        "/quiz"
      );
    }
  }, [userInfo]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Header />
      <TrainerMatchList userId={userId} />
    </div>
  );
};

export default MatchPage;
