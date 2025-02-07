import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const TrainerStatusModal = ({ isAccess, trainerId }) => {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        const handleModalAction = () => {
            if (isAccess === "거절") {
                navigate(`/trainer/${trainerId}/edit`); // 수정 페이지로 이동
            } else {
                navigate("/mypage"); // 마이페이지 이동
            }
        };

        const getModalContent = () => {
            switch (isAccess) {
                case "대기":
                    return {
                        title: "승인 대기 중",
                        text: "관리자의 승인을 받는 중입니다. 2~3일 정도 소요됩니다.",
                        confirmButtonText: "마이페이지",
                    };
                case "거절":
                    return {
                        title: "승인 거절됨",
                        text: "트레이너 신청이 거절되었습니다. 정보를 수정하여 다시 신청해 주세요.",
                        confirmButtonText: "수정하기",
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
            icon: isAccess === "거절" ? "error" : "info",
            confirmButtonText: modalContent.confirmButtonText,
            allowOutsideClick: false, // 바깥 클릭으로 닫히지 않게 설정
        }).then((result) => {
            if (result.isConfirmed) {
                handleModalAction();
            }
        });

    }, [isAccess, trainerId, navigate]);

    return null; // SweetAlert2는 별도의 UI 요소가 필요 없으므로 `null` 반환
};

export default TrainerStatusModal;
