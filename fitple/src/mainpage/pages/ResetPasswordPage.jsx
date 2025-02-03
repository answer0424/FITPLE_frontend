import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

const ResetPasswordPage = ({ onResetSuccess }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("id");
  const uuid = searchParams.get("uuid");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/member/reset-password?id=${email}&uuid=${uuid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email,
            uuid,
            newPassword,
          }),
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result);
      }

      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      onResetSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>비밀번호 변경</h3>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>새 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit" className="mt-3">
          비밀번호 변경
        </Button>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
