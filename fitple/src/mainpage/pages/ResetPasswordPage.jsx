import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import Headers from "../../common/component/Header";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { userId: id } = useParams();
  const navigate = useNavigate();

  console.log("User ID parameter:", id);

  // 비밀번호 유효성 검사 (8자 이상 & 특수문자 1개 이상)
  const validatePassword = (password) => {
    return password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validatePassword(newPassword)) {
      setError(
        "비밀번호는 최소 8자 이상이며, 특수문자 1개 이상 포함해야 합니다."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

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
        alert("로그인페이지로 이동합니다");
        setTimeout(() => navigate("/login"), 3000);
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
    <>
      <Headers />
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Card
          className="shadow-lg"
          style={{
            maxWidth: "450px",
            width: "100%",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "20px",
          }}
        >
          <Card.Body>
            <h3 className="text-center mb-4 text-white">비밀번호 변경</h3>

            {message && (
              <Alert variant="success" className="text-center">
                {message}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* 새 비밀번호 입력 */}
              <Form.Group className="mb-3">
                <Form.Label className="text-white">새 비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="새 비밀번호 입력"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                  }}
                />
                <Form.Text className="text-light">
                  최소 8자 이상, 특수문자 1개 이상 포함
                </Form.Text>
              </Form.Group>

              {/* 비밀번호 확인 입력 */}
              <Form.Group className="mb-3">
                <Form.Label className="text-white">비밀번호 확인</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="비밀번호 다시 입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "white",
                  }}
                />
                {confirmPassword && (
                  <Form.Text
                    style={{
                      color:
                        newPassword === confirmPassword ? "lightgreen" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {newPassword === confirmPassword
                      ? "✔ 비밀번호가 일치합니다."
                      : "❌ 비밀번호가 일치하지 않습니다."}
                  </Form.Text>
                )}
              </Form.Group>

              {/* 비밀번호 변경 버튼 */}
              <Button
                variant="outline-light"
                type="submit"
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "비밀번호 변경"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ResetPasswordPage;
