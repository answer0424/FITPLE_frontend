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
      .get(`${import.meta.env.VITE_Server}/member/id`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        console.log("가져온 사용자 정보:", res.data);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 오류:", error);
      });

    axios
      .get(`${import.meta.env.VITE_Server}/member/update-detail`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setPerPrice(res.data.perPrice || "");
        setCareer(res.data.career || "");
        setContent(res.data.content || "");
        setSkills(res.data.skills || []);
      })
      .catch((error) => {
        console.error("기존 프로필 정보 가져오기 오류:", error);
      });
  }, []);

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

    const skillNames = skills.map((skill) => skill.name);
    formData.append("skills", JSON.stringify(skillNames));

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

      const method = user.hasProfile ? "patch" : "post";
      const url = `${import.meta.env.VITE_Server}/member/detail`;

      const res = await axios({
        method,
        url,
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 200) {
        alert("트레이너 프로필이 등록되었습니다.");
      }
    } catch (error) {
      console.error("트레이너 프로필 등록 오류:", error.response || error);
      alert(
        error.response?.data?.message ||
          "프로필 등록 중 오류가 발생했습니다. 다시 시도해주세요."
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
            alt="Profile"
            className="rounded-circle me-3"
            width={60}
            height={60}
          />
          <p className="mb-0 fs-5">안녕하세요, {user.nickname}님!</p>
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
