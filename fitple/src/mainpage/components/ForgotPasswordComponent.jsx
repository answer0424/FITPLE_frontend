import { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";

const ForgotPasswordComponent = ({ onResetRequested }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8081/member/send-reset-email",
        {
          to: email,
        }
      );

      setMessage("재설정 이메일이 전송되었습니다. 이메일을 확인하세요.");
    } catch (error) {
      setError(error.response?.data || "이메일 전송 실패");
    }
  };

  return (
    <Container
      className="bg-dark text-white p-4 rounded shadow-lg mt-5"
      style={{
        maxWidth: "500px",
        width: "100%",
        height: "100vh",
        background: "black",
        color: "white",
      }}
    >
      <h3 className="text-center">비밀번호 재설정</h3>
      {message && (
        <Alert variant="success" className="text-white">
          {message}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="text-white">
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="text-white">이메일 주소</Form.Label>
          <Form.Control
            type="email"
            className="bg-secondary text-white"
            style={{ color: "white" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="outline-light" type="submit" className="mt-3 w-100">
          이메일 전송
        </Button>
      </Form>
    </Container>
  );
};

export default ForgotPasswordComponent;
