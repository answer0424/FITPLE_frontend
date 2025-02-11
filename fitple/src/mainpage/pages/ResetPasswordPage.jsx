import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import "../assets/styles/ResetPassword.css"; // 📌 추가된 CSS 파일
import Header from "../../common/component/Header";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { userId: id } = useParams();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validatePassword(newPassword)) {
      setError(
        "비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("id", id);
    formData.append("newPassword", newPassword);

    try {
      const response = await fetch(
        "http://localhost:8081/member/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        }
      );

      const result = await response.text();

      if (response.ok) {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(result || "비밀번호 변경에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="reset-password-container">
      <Header />
      <Container>
        <div className="reset-password-box">
          <h3>비밀번호 변경</h3>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">새 비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호 (최소 8자, 대소문자, 숫자 포함)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              비밀번호 변경
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
