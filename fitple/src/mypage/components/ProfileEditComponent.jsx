import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import moment from 'moment';
import api from '../../mainpage/apis/api';
import KakaoSearch from '../../mainpage/components/KakaoSearch';

const ProfilEditComponent = () => {
    const { userInfo, authority } = useContext(LoginContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editedInfo, setEditedInfo] = useState({
        nickname: userInfo.nickname || "",
        email: userInfo.email || "",
        address: userInfo.address || "",
        birth: userInfo.birth || '',
        userId: userInfo.id,
        gymId: userInfo.gym && userInfo.gym.id,
        authority: userInfo.authority,
        profileImage: userInfo.profileImage,
        HBTI: userInfo.hbti,
    });

    // 입력 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //주소 입력 처리 함수
    const handlePlaceSelect = (place) => {
        
        setEditedInfo((prev) => {
            return {
                ...prev,
                address: JSON.stringify(place.address),
            };
        })
        
        if(authority.isTrainer) {
            const placeInfo = { address: place.address, latitude: place.lat, longitude: place.lng, name: place.name };
            const gym = {
                ...placeInfo,
            };
            setEditedInfo((prev) => {
                return {
                    ...prev,
                    gym: gym,
                };
            })
        }
    };

    // 폼 제출 시 userInfo 업데이트
    const handleSubmit = (e) => {
        e.preventDefault();
        const accessToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];

        if (editedInfo.birth) {
            setEditedInfo((prevInfo) => ({
                ...prevInfo,
                birth: moment.utc(editedInfo.birth).format('YYYY-MM-DD'),
            }));
        }

        console.log(editedInfo);

        api.patch('/member/mypage', editedInfo, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
            //팝업창
            console.log(response.status)
            // localStorage에 미리 저장
            localStorage.setItem("userInfo", JSON.stringify({
                ...userInfo,
                ...editedInfo,
            }));
        })
        .catch((error) => {
            console.log(error)
        })
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file); // 파일을 선택한 후 상태에 저장
        }
    };

    // 프로필 사진을 서버에 업로드하는 함수
    const handleImageUpload = () => {
        if (!selectedImage) {
            alert("Please select an image first.");
            return;
        }

        const accessToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            ?.split("=")[1];

        console.log(userInfo.id)
        console.log(selectedImage)
        console.log(accessToken)

        const formData = new FormData();
        formData.append("userId", userInfo.id);
        formData.append("profileImage", selectedImage);

        // console.log("오긴해?");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        api.patch('/member/profileimg',
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        .then((response) => {
            console.log(response.status);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    // useEffect(() => {
    //     console.log(userInfo.birth)
    // }, [userInfo])

    return (
        <Container>
            <h2 className="my-4">Profile Edit</h2>
            <div>
                <Button variant="secondary" onClick={() => document.getElementById('profileImageInput').click()}>
                    Change Profile Image
                </Button>
                <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
            </div>
            <Button variant="primary" onClick={handleImageUpload}>
                프로필 사진 변경
            </Button>
            <Form onSubmit={handleSubmit}>

                <Form.Group>
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                        type="text"
                        name="nickname"
                        value={editedInfo.nickname}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={editedInfo.email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <KakaoSearch onPlaceSelect={handlePlaceSelect} initialAddress={userInfo.address} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Birth</Form.Label>
                    <Form.Control
                        type="date"
                        name="birth"
                        value={editedInfo.birth ? moment(editedInfo.birth).format('YYYY-MM-DD') : ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
};

export default ProfilEditComponent;