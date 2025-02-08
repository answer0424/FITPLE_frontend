import { useState } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
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
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        position: "relative",
      }}
    >
      <Header />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "calc(100vh - 76px)" }}
      >
        <Card
          className="shadow-lg"
          style={{
            maxWidth: "450px",
            width: "100%",
            background: "rgba(33, 37, 41, 0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Card.Body className="p-4">
            <h3 className="text-center mb-4 text-white">비밀번호 재설정</h3>

            {message && (
              <Alert
                variant="success"
                className="mb-4"
                style={{
                  background: "rgba(25, 135, 84, 0.9)",
                  border: "none",
                  color: "white",
                }}
              >
                {message}
              </Alert>
            )}

            {error && (
              <Alert
                variant="danger"
                className="mb-4"
                style={{
                  background: "rgba(220, 53, 69, 0.9)",
                  border: "none",
                  color: "white",
                }}
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="text-white">이메일 주소</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                    padding: "12px",
                  }}
                  className="rounded-3"
                />
              </Form.Group>

              <Button
                variant="outline-light"
                type="submit"
                className="w-100 py-2 mt-2"
                disabled={isLoading}
                style={{
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                {isLoading ? (
                  <span>
                    <i className="fas fa-spinner fa-spin me-2"></i>전송 중...
                  </span>
                ) : (
                  "이메일 전송"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
