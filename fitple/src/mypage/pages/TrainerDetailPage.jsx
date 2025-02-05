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
  const [deletedSkillsId, setDeletedSkillsId] = useState("");
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
      .get(`${import.meta.env.VITE_Server}/member/detail`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setUser(res.data), console.log("현재 사용자 : ", res.data);
      })
      .catch((error) => console.error("사용자 정보 가져오기 오류:", error));

    axios
      .get(`${import.meta.env.VITE_Server}/member/update-detail`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log("데이터 : ", res.data);
        console.log("certification : ", res.data.certificationId);
        setPerPrice(res.data.perPrice || "");
        setCareer(res.data.career || "");
        setContent(res.data.content || "");

        const parsedSkills =
          res.data.certifications
            ?.flatMap((cert) => {
              try {
                if (!cert.skills) return [];

                let cleanedSkills = cert.skills;
                if (typeof cert.skills === "string") {
                  cleanedSkills = cert.skills
                    .replace(/'/g, '"')
                    .replace(/\[\[/g, "[")
                    .replace(/\]\]/g, "]")
                    .replace(/\]+$/, "]");
                }

                const parsedSkillsArray =
                  typeof cleanedSkills === "string"
                    ? JSON.parse(cleanedSkills)
                    : cleanedSkills;

                // 각 스킬에 대해 해당 cert의 imageUrl 사용
                return parsedSkillsArray.map((skill) => ({
                  certificationId: cert.certificationId,
                  name: skill.name,
                  imageUrl: cert.imageUrl || "",
                }));
              } catch (error) {
                console.error("스킬 데이터 파싱 오류:", {
                  원본데이터: cert.skills,
                  에러메시지: error.message,
                });
                return [
                  {
                    certificationId: cert.certificationId,
                    name: "",
                    imageUrl: cert.imageUrl || "",
                  },
                ];
              }
            })
            .flat() || [];

        console.log("최종 파싱된 전체 스킬:", parsedSkills);
        setSkills(parsedSkills);
      })
      .catch((error) =>
        console.error("기존 프로필 정보 가져오기 오류:", error)
      );
  }, []);

  const handleDeleteSkill = (index) => {
    const skillToDelete = skills[index];
    console.log("삭제하려는 스킬 정보:", skillToDelete);

    if (skillToDelete?.certificationId) {
      const newDeletedSkillsId = [
        ...deletedSkillsId,
        skillToDelete.certificationId,
      ];
      setDeletedSkillsId(newDeletedSkillsId);
      console.log("삭제될 certificationId:", skillToDelete.certificationId);
      console.log("현재까지 삭제될 certificationId 목록:", newDeletedSkillsId);
    } else {
      console.log("새로 추가된 스킬이라 certificationId가 없습니다.");
    }

    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setNewSkill({ ...newSkill, imageFile: e.target.files[0] });
  };

  const handleAddSkill = () => {
    if (!newSkill.name) {
      alert("스킬 이름을 입력해 주세요.");
      return;
    }

    setSkills([...skills, { ...newSkill }]);

    setNewSkill({ name: "", imageFile: null });
    console.log("newSkill : ", newSkill.name, newSkill.imageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDatas = new FormData(e.target); // 폼 데이터 가져오기
    const entries = Object.fromEntries(formDatas.entries()); // 객체로 변환
    console.log("entries : ", entries);
    if (!user) {
      alert("사용자 정보를 가져오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    if (!perPrice || !career) {
      alert("가격과 경력을 입력해주세요.");
      return;
    }

    const editorContent = quillRef.current
      ? quillRef.current.getEditor().root.innerHTML
      : content;

    const formData = new FormData();
    formData.append("trainerId", user.id);
    formData.append("content", editorContent);
    formData.append("perPrice", perPrice);
    formData.append("career", career);

    if (deletedSkillsId.length > 0) {
      formData.append("deletedSkillsId", JSON.stringify(deletedSkillsId));
    }

    const newSkills = skills.filter((skill) => !skill.certificationId);
    const skillData = newSkills.map((skill) => ({ name: skill.name }));
    formData.append("skills", JSON.stringify(skillData));

    newSkills.forEach((skill) => {
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
      console.log("전송 전 deletedSkillsId:", deletedSkillsId);

      // if (deletedSkillsId.length > 0) {
      //   if (deletedSkillsId.length > 0) {
      //     deletedSkillsId.forEach((id) => {
      //       formData.append("deletedSkillsId", id);
      //     });
      //   }
      // }

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
          <label className="form-label">상세 내용 작성:</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">스킬 등록:</label>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="스킬 이름"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
            />
            <input
              type="file"
              className="form-control"
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
        <div className="mb-4">
          <label className="form-label">보유 스킬:</label>
          <ul className="list-group">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center">
                  {skill.imageUrl && (
                    <img
                      src={skill.imageUrl}
                      alt={skill.name}
                      className="me-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                  )}
                  {skill.name}
                </div>
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
        <button type="submit" className="btn btn-primary w-100 mt-3">
          등록하기
        </button>
      </form>
    </div>
  );
};

export default TrainerProfilePage;
