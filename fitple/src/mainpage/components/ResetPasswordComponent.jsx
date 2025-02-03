import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const ResetPasswordComponent = ({ email, onResetSuccess }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        "http://loacalhost:8081/member/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email,
            code,
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
          <Form.Label>인증 코드</Form.Label>
          <Form.Control
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </Form.Group>
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

export default ResetPasswordComponent;
