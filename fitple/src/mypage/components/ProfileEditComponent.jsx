import React, { useContext, useState } from "react";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import moment from "moment";
import api from "../../mainpage/apis/api";
import KakaoSearch from "../../mainpage/components/KakaoSearch";
import axios from "axios";
import "../static/css/ProfileEditComponent.css";

const ProfileEditComponent = () => {
  const { userInfo, authority, setUserInfo } = useContext(LoginContext);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceSelect = (place) => {
    setEditedInfo((prev) => ({
      ...prev,
      address: JSON.stringify(place.address),
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (editedInfo.birth) {
      setEditedInfo((prevInfo) => ({
        ...prevInfo,
        birth: moment.utc(editedInfo.birth).format("YYYY-MM-DD"),
      }));
    }

    api
      .patch("/member/mypage", editedInfo, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setUserInfo({ ...userInfo, ...editedInfo });
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        alert("Error updating profile.");
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image first.");
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

      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Error:", error.response || error);
      alert("Error uploading profile image.");
    }
  };

  return (
    <Container className="profile-edit-container mt-5 p-4 bg-light shadow rounded">
      <h2 className="text-center mb-4">Edit Profile</h2>

      <Form onSubmit={handleImageUpload}>
        <Row className="justify-content-center text-center">
          <Col md={4} className="mb-3">
            <Image
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : userInfo.profileImage
              }
              roundedCircle
              className="img-fluid border profile-image"
              alt="Profile Preview"
            />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => document.getElementById("profileImage").click()}
            >
              Change Profile Image
            </Button>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col md={6}>
            <Button type="submit" variant="primary" className="w-100">
              Upload Image
            </Button>
          </Col>
        </Row>
      </Form>

      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Nickname</Form.Label>
          <Form.Control
            type="text"
            name="nickname"
            value={editedInfo.nickname}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={editedInfo.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <KakaoSearch
            onPlaceSelect={handlePlaceSelect}
            initialAddress={userInfo.address}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Birth</Form.Label>
          <Form.Control
            type="date"
            name="birth"
            value={editedInfo.birth ? moment(editedInfo.birth).format("YYYY-MM-DD") : ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default ProfileEditComponent;
