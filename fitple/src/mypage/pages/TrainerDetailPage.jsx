import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Headers from "../../common/component/Header";
import "../static/css/TrainerDetailWrite.css";
import "quill-emoji/dist/quill-emoji.css";
const TrainerProfilePage = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [perPrice, setPerPrice] = useState("");
  const [career, setCareer] = useState("");
  const [hbti, setHbti] = useState("");
  const [gymName, setGymName] = useState("");
  const [skills, setSkills] = useState([]);
  const [deletedSkillsId, setDeletedSkillsId] = useState("");
  const [newSkill, setNewSkill] = useState({ name: "", imageFile: null });
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const gotoDetail = () => {
    navigate(`/member`);
  };

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
        if (res.data.authority === "ROLE_STUDENT") {
          alert("접근권한이 없습니다");
          navigate("/member");
        }
        setGymName(res.data?.gym?.name ?? "정보 없음");
        console.log(res.data.gym.name ?? "정보 없음");
        setHbti(res.data?.hbti?.hbti ?? "정보 없음");
        console.log(res.data.hbti.hbti ?? "정보 없음");
        console.log(res.data);
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

        if (res.data.isAccess === "대기 ") {
          alert("프로필이 승인 대기중입니다, 수정이 불가능합니다");
          navigate("/member");
        }

        const isNewProfile =
          !res.data.perPrice && !res.data.career && !res.data.content;

        if (res.data.authority === "ROLE_TRAINER" && isNewProfile) {
          alert("신규프로필을 작성해주세요");
        } else {
          alert("기존 프로필 내용이 존재합니다. 내용을 확인 후 수정하세요!");
        }
        setPerPrice(res.data.perPrice || "");
        setCareer(res.data.career || "");
        setContent(res.data.content || "");

        const parsedSkills =
          res.data.certifications
            ?.flatMap((cert) => {
              try {
                if (!cert.skills) return [];

                // If skills is already an array, use it directly
                if (Array.isArray(cert.skills)) {
                  return cert.skills.map((skill) => ({
                    certificationId: cert.certificationId,
                    name: typeof skill === "string" ? skill : skill.name,
                    imageUrl: cert.imageUrl || "",
                  }));
                }

                // Handle string input
                let cleanedSkills = cert.skills;

                // If it's a simple string (like "경력"), wrap it in an array
                if (
                  typeof cleanedSkills === "string" &&
                  !cleanedSkills.includes("[")
                ) {
                  return [
                    {
                      certificationId: cert.certificationId,
                      name: cleanedSkills,
                      imageUrl: cert.imageUrl || "",
                    },
                  ];
                }

                // Process JSON-like string
                if (typeof cleanedSkills === "string") {
                  cleanedSkills = cleanedSkills
                    .replace(/'/g, '"') // Replace single quotes with double quotes
                    .replace(/\[\[/g, "[") // Fix nested brackets
                    .replace(/\]\]/g, "]") // Fix nested brackets
                    .replace(/\]+$/, "]") // Clean up trailing brackets
                    .replace(/,$/, "") // Remove trailing comma
                    .trim(); // Remove whitespace

                  // Ensure proper JSON array structure
                  if (!cleanedSkills.startsWith("[")) {
                    cleanedSkills = "[" + cleanedSkills;
                  }
                  if (!cleanedSkills.endsWith("]")) {
                    cleanedSkills += "]";
                  }

                  // Parse the JSON string
                  const parsedSkillsArray = JSON.parse(cleanedSkills);

                  return parsedSkillsArray.map((skill) => ({
                    certificationId: cert.certificationId,
                    name: typeof skill === "string" ? skill : skill.name,
                    imageUrl: cert.imageUrl || "",
                  }));
                }

                // If we reach here, return default structure
                return [
                  {
                    certificationId: cert.certificationId,
                    name: String(cert.skills),
                    imageUrl: cert.imageUrl || "",
                  },
                ];
              } catch (error) {
                console.error("스킬 데이터 파싱 오류:", {
                  원본데이터: cert.skills,
                  에러메시지: error.message,
                });

                // Return single skill entry with original data
                return [
                  {
                    certificationId: cert.certificationId,
                    name: String(cert.skills), // Convert to string to ensure safe display
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
    formData.append("content", content);
    formData.append("perPrice", perPrice);
    formData.append("career", career);
    formData.append("hbti", hbti);
    formData.append("gymName", gymName);

    if (deletedSkillsId.length > 0) {
      deletedSkillsId.forEach((id) => {
        formData.append("deletedSkillsId", Number(id)); // ✅ 숫자로 변환
      });
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
      // alert(
      //   error.response?.data?.message || "프로필 등록 중 오류가 발생했습니다."
      // );
    }
  };

  return (
    <div className="trainer-profile">
      <Headers />
      <div className="trainer-profile__container">
        {user && (
          <div className="trainer-profile__header">
            <img
              src={`${import.meta.env.VITE_Server}${user.imageUrl}`}
              alt="프로필"
              className="trainer-profile__avatar"
            />
            <p className="trainer-profile__greeting">
              {user.nickname}님, 안녕하세요!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="trainer-profile__form">
          <div className="trainer-profile__form-group">
            <label style={{ color: "black" }}>1회 가격 (₩):</label>
            <input
              style={{ color: "black" }}
              type="number"
              className="detail-input"
              value={perPrice}
              onChange={(e) => setPerPrice(e.target.value)}
              required
            />
          </div>

          <div className="trainer-profile__form-group">
            <label style={{ color: "black" }}>경력 시작 날짜:</label>
            <input
              className="detail-input"
              style={{ color: "black" }}
              type="date"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              required
            />
          </div>

          <div className="trainer-profile__form-group">
            <label style={{ color: "black" }}>HBTI:</label>
            <div
              className="detail-input"
              style={{ color: "black", fontSize: "1.2rem" }}
              required
            >
              {hbti}
            </div>
          </div>

          <div className="trainer-profile__form-group">
            <label style={{ color: "black" }}>체육관 이름:</label>
            <div className="detail-input" style={{ color: "black" }} required>
              {gymName}
            </div>
          </div>

          <div className="trainer-profile__form-group">
            <label style={{ color: "black" }}>상세 내용 작성:</label>
            <ReactQuill
              className="detail-input"
              style={{ color: "black", height: "500px" }}
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
            />
          </div>

          <div className="trainer-profile__form-group">
            <label className="form-label" style={{ color: "black" }}>
              스킬 등록:
            </label>
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
            </div>{" "}
            <div className="trainer-profile__form-group">
              <label className="form-label" style={{ color: "black" }}>
                보유 스킬:
              </label>
              <ul className="list-group">
                {skills.map((skill, index) => {
                  // 개별 스킬의 이미지 URL을 변환
                  const skillImageUrl =
                    skill?.imageUrl && typeof skill.imageUrl === "string"
                      ? skill.imageUrl.startsWith("./")
                        ? skill.imageUrl.replace("./", "/") // 점 제거
                        : skill.imageUrl
                      : ""; // 기본값 설정

                  // 백엔드 서버 주소와 결합하여 최종 이미지 URL 생성
                  const fullSkillImageUrl = `${
                    import.meta.env.VITE_Server
                  }${skillImageUrl}`;
                  console.log("보내는 url", fullSkillImageUrl);

                  return (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{ color: "black" }}
                      >
                        {skill.imageUrl && (
                          <img
                            src={fullSkillImageUrl} // 개별 스킬 이미지 URL 적용
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
                        style={{ width: "50px" }}
                      >
                        삭제
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <button
            type="submit"
            className="trainer-profile__btn-submit"
            onClick={gotoDetail}
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainerProfilePage;
