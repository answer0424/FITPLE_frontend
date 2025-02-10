import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import moment from 'moment';
import api from '../../mainpage/apis/api';

const ProfilEditComponent = () => {
    const { userInfo } = useContext(LoginContext);

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

    // date 변환 입력 처리 함수
    const handleDateChange = (e) => {
        const formattedDate = moment.utc(e.target.value).format('YYYY-MM-DD');
        setEditedInfo({
            ...editedInfo,
            birth: formattedDate,  // moment로 변환한 날짜를 사용
        });
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

    useEffect(() => {
        console.log(userInfo)
    }, [userInfo])

    return (
        <Container>
            <h2 className="my-4">Profile Edit</h2>
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
                    <Form.Control
                        type="text"
                        name="address"
                        value={editedInfo.address}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Birth</Form.Label>
                    <Form.Control
                        type="date"
                        name="birth"
                        value={editedInfo.birth}
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