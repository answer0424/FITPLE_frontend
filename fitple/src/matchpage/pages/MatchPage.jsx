import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TrainerMatchList from "../components/TrainerMatchList";
import Header from "../../common/component/Header";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "js-cookie";
import TrainerSearchList from "../components/TrainerSearchList";

const MatchPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { authority } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(true);
  const [latestUserInfo, setLatestUserInfo] = useState(null);
  const SwalWithReact = withReactContent(Swal);

  // SweetAlert를 공통으로 처리하는 함수
  const showAlertAndRedirect = async (title, text, redirectPath) => {
    await SwalWithReact.fire({
      icon: "error",
      title,
      text,
      confirmButtonText: "확인",
      confirmButtonColor: "#3085d6",
    });
    navigate(redirectPath);
  };

  // ✅ 로그인한 유저의 최신 정보를 가져와서 업데이트하는 함수
  const fetchLatestUserInfo = async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("❌ 토큰 없음: 로그인 페이지로 이동");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_Server}/register/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        console.error("❌ 사용자 정보를 가져오는 데 실패했습니다.");
        navigate("/login");
        return;
      }

      const userData = await response.json();
      console.log("✅ 최신 사용자 정보 가져옴:", userData);
      setLatestUserInfo(userData);
    } catch (error) {
      console.error("❌ 사용자 정보 불러오기 실패:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestUserInfo();
  }, []);

  // ✅ 최신 유저 정보를 불러온 후에만 검사 실행
  useEffect(() => {
    if (!isLoading && latestUserInfo) {
      const userAuthority = latestUserInfo.authority;
  
      // ✅ 관리자(ROLE_ADMIN)는 제한 없이 접근 가능
      if (userAuthority.includes("ROLE_ADMIN")) {
        return; // 아무 제한 없이 그대로 진행
      }
  
      // ✅ 트레이너(ROLE_TRAINER) 접근 제한
      if (userAuthority.includes("ROLE_TRAINER")) {
        showAlertAndRedirect(
          "권한이 없습니다",
          "매칭 페이지에 접근할 수 없습니다.",
          "/"
        );
        return;
      }
  
      // ✅ HBTI 정보가 없으면 퀴즈 페이지로 이동
      if (!latestUserInfo.hbti) {
        showAlertAndRedirect(
          "HBTI 데이터가 없습니다.",
          "HBTI 테스트를 진행해주세요.",
          "/quiz"
        );
      }
    }
  }, [latestUserInfo, isLoading]);

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Header />
      {/* <TrainerSearchList /> */}
      <TrainerMatchList userId={userId} />
    </div>
  );
};

export default MatchPage;
