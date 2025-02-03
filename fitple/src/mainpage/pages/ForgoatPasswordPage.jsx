import { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import axios from "axios";
import Header from "../../common/component/Header";

const ForgotPasswordPage = ({ onResetRequested }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/member/send-reset-email",
        {
          to: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 자격 증명을 포함하도록 설정
        }
      );

      if (response.status === 200) {
        setMessage("재설정 이메일이 전송되었습니다. 이메일을 확인하세요.");
        if (onResetRequested) {
          onResetRequested(email);
        }
      }
    } catch (error) {
      console.error("비밀번호 재설정 이메일 전송 오류:", error);

      if (error.response?.status === 400) {
        setError("등록되지 않은 이메일 주소입니다.");
      } else if (error.response?.status === 404) {
        setError("이메일 주소를 찾을 수 없습니다.");
      } else {
        setError("이메일 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      className="bg-dark text-white p-4 rounded shadow-lg mt-5"
      style={{
        width: "100%",
        height: "100vh",
        background: "black",
        color: "white",
      }}
    >
      <Header />
      <h3 className="text-center mb-4">비밀번호 재설정</h3>
      {message && (
        <Alert variant="success" className="text-white bg-success">
          {message}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="text-white bg-danger">
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="text-white">이메일 주소</Form.Label>
          <Form.Control
            type="email"
            className="bg-secondary text-white"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {isLoading ? "전송 중..." : "이메일 전송"}
        </Button>
      </Form>
    </Container>
  );
};

export default ForgotPasswordPage;
