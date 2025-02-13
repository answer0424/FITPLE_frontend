import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import api from "../../mainpage/apis/api";
import KakaoSearch from "../../mainpage/components/KakaoSearch";
import axios from "axios";
import "../static/css/ProfileEditComponent.css";
import img from "../../assets/userProfileBasic.png"

const ProfileEditComponent = () => {
    const { userInfo, authority, loginCheck } = useContext(LoginContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editedInfo, setEditedInfo] = useState({
        nickname: userInfo.nickname || "",
        email: userInfo.email || "",
        address: userInfo.address || "",
        birth: userInfo.birth || "",
        userId: userInfo.id,
        gymId: userInfo.gym && userInfo.gym.id,
        authority: userInfo.authority,
        profileImage: userInfo.profileImage,
        HBTI: userInfo.hbti,
    });

    useEffect(() => {
        console.log(userInfo);
    }, [userInfo]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 주소 선택 핸들러
    const handlePlaceSelect = (place) => {
        setEditedInfo((prev) => ({
            ...prev,
            address: place.address,
        }));

        if (authority.isTrainer) {
            setEditedInfo((prev) => ({
                ...prev,
                gym: {
                    address: place.address,
                    latitude: place.lat,
                    longitude: place.lng,
                    name: place.name,
                },
            }));
        }
    };

    // 프로필 정보 저장 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];

        if (editedInfo.birth) {
            editedInfo.birth = moment.utc(editedInfo.birth).format("YYYY-MM-DD");
        }

        try {
            await api.patch("/member/mypage", editedInfo, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            loginCheck();
            alert("프로필이 업데이트되었습니다.");
        } catch (error) {
            console.error(error);
            alert("프로필 업데이트 중 오류 발생");
        }
    };

    // 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    // 프로필 사진 서버 업로드
    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!selectedImage) {
            alert("이미지를 선택해주세요.");
            return;
        }

        const accessToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];

        const formData = new FormData();
        formData.append("userId", userInfo.id);
        formData.append("profileImage", selectedImage);

        try {
            await axios.post(
                `${import.meta.env.VITE_Server}/member/profile-img`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setUserInfo((prev) => ({ ...prev, profileImage: selectedImage }));
            alert("프로필 이미지가 업로드되었습니다.");
        } catch (error) {
            console.error("오류:", error.response || error);
            alert("프로필 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container className="profileEditComponent-container col col-md-4">
            <h2 className="profileEditComponent-title">프로필 수정</h2>

            <Row className="profileEditComponent-row">
                {/* 프로필 이미지 섹션 */}
                <Col md={4} className="profileEditComponent-imageCol">
                    <div className="profileEditComponent-imageWrapper">
                        <img
                            src={
                                selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : userInfo.profileImage
                                    ? `${import.meta.env.VITE_Server}/${userInfo.profileImage}`
                                    : img
                            }
                            className="profileEditComponent-profileImage"
                            alt="Profile Preview"
                        />
                        <Button
                            className="profileEditComponent-editBtn"
                            onClick={() => document.getElementById("profileImage").click()}
                        >
                            프로필 수정
                        </Button>
                        <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        <Form onSubmit={handleImageUpload}>
                            <Button type="submit" className="profileEditComponent-uploadButton">
                                업로드
                            </Button>
                        </Form>
                    </div>
                </Col>

                {/* 프로필 정보 입력 */}
                <Col md={8} className="profileEditComponent-infoCol">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="profileEditComponent-formGroup">
                            <Form.Label>닉네임</Form.Label>
                            <Form.Control
                                type="text"
                                name="nickname"
                                className="profileEditComponent-formControl"
                                value={editedInfo.nickname}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="profileEditComponent-formGroup">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control
                                type="email"
                                className="profileEditComponent-formControl"
                                value={editedInfo.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="profileEditComponent-formGroup">
                            <Form.Label>주소</Form.Label>
                            <KakaoSearch
                                onPlaceSelect={handlePlaceSelect}
                                initialAddress={editedInfo.address}
                            />
                        </Form.Group>

                        <Form.Group className="profileEditComponent-formGroup">
                            <Form.Label>생년월일</Form.Label>
                            <Form.Control
                                type="date"
                                name="birth"
                                className="profileEditComponent-formControl"
                                value={editedInfo.birth ? new Date(editedInfo.birth).toISOString().split('T')[0] : ''}  // null 체크 추가
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button type="submit" className="profileEditComponent-saveButton">
                            저장
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfileEditComponent;
