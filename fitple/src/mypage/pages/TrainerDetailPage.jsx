import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TrainerProfilePage = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [perPrice, setPerPrice] = useState("");
  const [career, setCareer] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    name: "",
    imageFile: null,
  });
  const quillRef = useRef(null);

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      console.error("액세스 토큰이 없습니다. 로그인이 필요합니다.");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_Server}/member/detail`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log("현재 로그인한 유저 : ", res.data);
        setUser(res.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 오류:", error);
      });

    axios
      .get(`${import.meta.env.VITE_Server}/member/update-detail`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setPerPrice(res.data.perPrice || "");
        setCareer(res.data.career || "");
        setContent(res.data.content || "");

        // 자격증 데이터 처리 (NullPointerException 방지)
        const parsedSkills =
          res.data.certifications?.map((cert) => ({
            name: Array.isArray(cert.skills)
              ? cert.skills[0]
              : typeof cert.skills === "string"
              ? JSON.parse(cert.skills)[0]
              : "",
            imageFile: null, // 이미지 파일을 나중에 업로드할 수 있도록 처리
          })) || [];

        setSkills(parsedSkills);
      })
      .catch((error) => {
        console.error("기존 프로필 정보 가져오기 오류:", error);
      });
  }, []);

  const handleDeleteSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setNewSkill({
      ...newSkill,
      imageFile: e.target.files[0],
    });
  };

  const handleAddSkill = () => {
    if (!newSkill.name) {
      alert("스킬 이름을 입력해 주세요.");
      return;
    }

    setSkills([...skills, { ...newSkill }]);
    setNewSkill({ name: "", imageFile: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("사용자 정보를 가져오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    if (!perPrice || !career) {
      alert("가격과 경력을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("trainerId", user.id);
    formData.append("content", content);
    formData.append("perPrice", perPrice);
    formData.append("career", career);

    const skillData = skills.map((skill) => ({
      name: skill.name,
    }));

    formData.append("skills", JSON.stringify(skillData));

    skills.forEach((skill) => {
      if (skill.imageFile) {
        formData.append("image", skill.imageFile);
      }
    });

    try {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      await axios.post(
        `${import.meta.env.VITE_Server}/member/detail`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("트레이너 프로필이 등록되었습니다.");
    } catch (error) {
      console.error("트레이너 프로필 등록 오류:", error.response || error);
      alert(
        error.response?.data?.message || "프로필 등록 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">트레이너 프로필 작성</h2>
      {user && (
        <div className="d-flex align-items-center mb-3">
          <img
            src={user.profileImage}
            alt="프로필"
            className="rounded-circle me-3"
            width={60}
            height={60}
          />
          <p className="mb-0 fs-5">{user.nickname}님, 안녕하세요!</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label className="form-label">1회 가격 (₩):</label>
          <input
            type="number"
            className="form-control shadow-sm"
            value={perPrice}
            onChange={(e) => setPerPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">경력 시작 날짜:</label>
          <input
            type="date"
            className="form-control shadow-sm"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label">스킬 추가:</label>
          <div className="d-flex align-items-center">
            <input
              type="text"
              placeholder="스킬 이름"
              className="form-control me-2"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
            />
            <input
              type="file"
              className="form-control me-2"
              onChange={handleFileChange}
              accept="image/*"
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAddSkill}
            >
              추가
            </button>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">선택한 스킬:</label>
          <ul className="list-group">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="list-group-item d-flex align-items-center"
              >
                <span className="me-2">{skill.name}</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm ms-auto"
                  onClick={() => handleDeleteSkill(index)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <label className="form-label">상세 내용 작성:</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          등록하기
        </button>
      </form>
    </div>
  );
};

export default TrainerProfilePage;
