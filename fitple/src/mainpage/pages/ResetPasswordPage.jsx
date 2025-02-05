import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

const ResetPasswordPage = () => {
  // 상태 변수 설정
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // URL 파라미터에서 값 추출
  const { userId: id } = useParams();
  const navigate = useNavigate();

  console.log("Email parameter:", id); // 디버깅 로그 추가
  // console.log("Code parameter:", code); // 디버깅 로그 추가

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

    // 서버에 전송할 데이터 구성 (x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append("id", id);
    // formData.append("email", email);
    // formData.append("code", code); // uuid -> code로 변경
    formData.append("newPassword", newPassword);

    try {
      const response = await fetch(
        "http://localhost:8081/member/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const result = await response.text();

      if (response.ok) {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
        // setTimeout(() => {
        //   navigate("/login"); // 3초 후 로그인 페이지로 이동
        // }, 3000);
      } else {
        setError(result || "비밀번호 변경에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>비밀번호 변경</h3>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>새 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          비밀번호 변경
        </Button>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
