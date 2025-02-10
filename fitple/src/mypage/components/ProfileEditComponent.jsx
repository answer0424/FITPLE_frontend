import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

const ProfilEditComponent = () => {
    const { userInfo } = useContext(LoginContext);

    const [editedInfo, setEditedInfo] = useState({
        nickname: userInfo.nickname || "",
        email: userInfo.email || "",
        address: userInfo.address || "",
        birth: userInfo.birth ? userInfo.birth.split('T')[0] : "",  // Date를 YYYY-MM-DD 형식으로 변환
    });

    // 입력 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // birth 값이 Date 형식이므로, 입력 후 필요한 형태로 변환해야 합니다.
    const handleDateChange = (e) => {
        setEditedInfo({
            ...editedInfo,
            birth: e.target.value,
        });
    };

    // 폼 제출 시 userInfo 업데이트
    const handleSubmit = (e) => {
        e.preventDefault();

        // localStorage에도 저장
        localStorage.setItem("userInfo", JSON.stringify({
            ...userInfo,
            ...editedInfo,
        }));

        // 필요한 경우 서버에 변경된 데이터를 보낼 수 있음
        console.log("수정된 정보:", editedInfo);
    };

    return (
        <Container>
            <h2 className="my-4">Profile Edit</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>Nickname</Form.Label>
                        <Form.Control
                            type="text"
                            name="nickname"
                            value={editedInfo.nickname}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={editedInfo.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={editedInfo.address}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                        <Form.Label>Birth</Form.Label>
                        <Form.Control
                            type="date"
                            name="birth"
                            value={editedInfo.birth}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Row>

                {/* 읽기 전용 정보 */}
                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>Authority</Form.Label>
                        <Form.Control
                            type="text"
                            value={userInfo.authority}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                        <Form.Label>Profile Image</Form.Label>
                        <Form.Control
                            type="text"
                            value={userInfo.profileImage || 'No image'}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="6">
                        <Form.Label>HBTI</Form.Label>
                        <Form.Control
                            type="text"
                            value={userInfo.HBTI || 'Not available'}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6">
                        <Form.Label>Gym ID</Form.Label>
                        <Form.Control
                            type="text"
                            value={userInfo.gymId || 'Not available'}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
};

export default ProfilEditComponent;