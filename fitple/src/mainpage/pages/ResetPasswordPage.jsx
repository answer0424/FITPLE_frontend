import { useState } from "react";
import ForgotPasswordComponent from "../components/ForgotPasswordComponent";
import ResetPasswordComponent from "../components/ResetPasswordComponent";
import Header from "../../common/component/Header";

const ResetPasswordPage = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState("");

  const handleResetRequested = (userEmail) => {
    setEmail(userEmail);
    setIsResetting(true);
  };

  const handleResetSuccess = () => {
    alert("비밀번호가 변경되었습니다. 로그인 페이지로 이동하세요.");
    setIsResetting(false);
  };

  return (
    <div className="container">
      <Header />
      {isResetting ? (
        <ResetPasswordComponent
          email={email}
          onResetSuccess={handleResetSuccess}
        />
      ) : (
        <ForgotPasswordComponent onResetRequested={handleResetRequested} />
      )}
    </div>
  );
};

export default ResetPasswordPage;
