import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import Header from "../../common/component/Header";
import "../assets/styles/ResetPassword.css"; 

const ResetPasswordPage = () => {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const { userId: id } = useParams();
  const navigate = useNavigate();

  console.log("User ID parameter:", id);

  // 비밀번호 변경 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // 비밀번호 일치 여부 확인
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    // 서버에 전송할 데이터 구성 (x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append("id", id);
    formData.append("newPassword", newPassword);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_Server}/member/reset-password`,
        {
          method: "POST",
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const result = await response.text();

      if (response.ok) {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
        setTimeout(() => {
          navigate("/login"); 
        }, 3000);
      } else {
        setError(result || "비밀번호 변경에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-wrapper">
      <Header />
      <Container className="reset-password-container">
        <div className="reset-password-box">
          <h3 className="text-center mb-4 fw-bold text-white">비밀번호 변경</h3>

          {message && (
            <Alert variant="success" className="text-white border-0">
              {message}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" className="text-white border-0">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">새 비밀번호</Form.Label>
              <Form.Control
                type="password"
                className="bg-dark bg-opacity-50 text-white border-secondary"
                placeholder="새 비밀번호 입력"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                className="bg-dark bg-opacity-50 text-white border-secondary"
                placeholder="비밀번호 다시 입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Button
              variant="outline-light"
              type="submit"
              className="mt-3 w-100"
              disabled={isLoading}
            >
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
