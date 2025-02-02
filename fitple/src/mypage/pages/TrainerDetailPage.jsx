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
  const [newSkill, setNewSkill] = useState({ name: "", imageFile: null });
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
      .get("http://localhost:8081/register/user", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        console.log("가져온 사용자 정보:", response.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 오류:", error);
        if (error.response?.status === 401) {
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        }
      });
  }, []);

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.imageFile) {
      alert("스킬 이름과 자격증 이미지를 선택해 주세요.");
      return;
    }
    setSkills([...skills, newSkill]);
    setNewSkill({ name: "", imageFile: null });
  };

  const handleDeleteSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setNewSkill({ ...newSkill, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perPrice || !career) {
      alert("가격과 경력을 입력해주세요.");
      return;
    }

    const formData = new FormData();

    // 필수 필드 추가
    formData.append("trainerId", user.id); // 트레이너 ID 추가
    formData.append("content", content);
    formData.append("perPrice", perPrice);
    formData.append("career", career);

    // 스킬 정보 추가
    const skillNames = skills.map((skill) => skill.name);
    formData.append("skills", JSON.stringify(skillNames));

    // 이미지 파일들 추가
    skills.forEach((skill, index) => {
      if (skill.imageFile) {
        formData.append(`image`, skill.imageFile);
      }
    });

    // FormData 내용 확인을 위한 로깅
    for (let pair of formData.entries()) {
      console.log("FormData 내용:", pair[0], pair[1]);
    }

    try {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      const res = await axios.post(
        "http://localhost:8081/member/detail",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("서버 응답:", res);

      if (res.status === 200) {
        alert("트레이너 프로필이 등록되었습니다.");
        // 성공 후 필요한 페이지로 리다이렉션
        // window.location.href = '/success-page';
      }
    } catch (error) {
      console.error("트레이너 프로필 등록 오류:", error.response || error);
      alert(
        error.response?.data?.message ||
          "프로필 등록 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  // ... 나머지 렌더링 코드는 동일

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">트레이너 프로필 작성</h2>
      {user && (
        <div className="d-flex align-items-center mb-3">
          <img
            src={user.profileImage}
            alt="Profile"
            className="rounded-circle me-3"
            width={60}
            height={60}
          />
          <p className="mb-0 fs-5">안녕하세요, {user.username}님!</p>
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
          <label className="form-label">경력 (연도):</label>
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
                  className="btn btn-danger btn-sm"
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
