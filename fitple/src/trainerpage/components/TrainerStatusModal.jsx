import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const TrainerStatusModal = ({ trainer }) => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const handleModalAction = () => {
      if (!trainer) {
        navigate("/member/detail/write"); 
      } else if (trainer.isAccess === "거절") {
        navigate(`/member/detail/write`);
      } else if (trainer.isAccess === "대기") {
        navigate("/member"); 
      }
    };

    const getModalContent = () => {
      if (!trainer) {
        return {
          title: "트레이너 정보 없음",
          text: "트레이너 정보가 없습니다. 먼저 프로필을 작성해주세요.",
          confirmButtonText: "작성하기",
          icon: "warning",
        };
      }

      switch (trainer.isAccess) {
        case "대기":
          return {
            title: "승인 대기 중",
            text: "관리자의 승인을 받는 중입니다. 2~3일 정도 소요됩니다.",
            confirmButtonText: "마이페이지",
            icon: "info",
          };
        case "거절":
          return {
            title: "승인 거절됨",
            text: "트레이너 신청이 거절되었습니다. 정보를 수정하여 다시 신청해 주세요.",
            confirmButtonText: "수정하기",
            icon: "error",
          };
        default:
          return null;
      }
    };

    const modalContent = getModalContent();
    if (!modalContent) return;

    MySwal.fire({
      title: modalContent.title,
      text: modalContent.text,
      icon: modalContent.icon,
      confirmButtonText: modalContent.confirmButtonText,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleModalAction();
      }
    });
  }, [trainer, navigate]);

  return null;
};

export default TrainerStatusModal;
