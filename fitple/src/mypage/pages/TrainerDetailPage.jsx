import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TrainerProfilePage = ({ user }) => {
  const [content, setContent] = useState("");
  const [perPrice, setPerPrice] = useState("");
  const [career, setCareer] = useState("");
  const [skills, setSkills] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("perPrice", perPrice);
    formData.append("career", career);
    skills.forEach((skill, i) => formData.append(`skills[${i}]`, skill));

    const res = await axios.post(
      "http://localhost:8081/member/detail",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (res.status === 200) alert("트레이너 프로필이 등록되었습니다.");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary">트레이너 프로필 작성</h2>
      {user && (
        <div className="d-flex align-items-center mb-3">
          <img
            src={user.profileImage}
            alt="Profile"
            className="rounded-circle me-3"
            width={50}
            height={50}
          />
          <p className="mb-0">안녕하세요, {user.name}님!</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label className="form-label">1회 가격 (₩):</label>
          <input
            type="number"
            className="form-control"
            value={perPrice}
            onChange={(e) => setPerPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">경력 (연도):</label>
          <input
            type="date"
            className="form-control"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">스킬 선택:</label>
          <input
            type="text"
            placeholder="예: PT, 요가"
            className="form-control"
            onChange={(e) => setSkills(e.target.value.split(","))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">상세 내용 작성:</label>
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          등록하기
        </button>
      </form>
    </div>
  );
};

export default TrainerProfilePage;
