import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './ResultModal.css';
import HBTIResultDisplay from '../quiz_common/HbtiResultDisplay';

const ResultModal = ({ isOpen, onClose, userId, hbtiType, answers }) => {
    const [hbtiData, setHbtiData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHbtiData = async () => {
            if (!hbtiType) {
                console.log("No hbtiType available");
                return;
            }
            
            try {
                console.log("Fetching HBTI data for type:", hbtiType);
                const response = await axios.get(
                    `${import.meta.env.VITE_Server}/api/hbti/type/${hbtiType}`
                );
                setHbtiData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("HBTI 데이터 로드 실패:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (isOpen && hbtiType) {
            fetchHbtiData();
        }
    }, [isOpen, hbtiType]);

    const handleViewDetails = async () => {
        if (!userId) {
            alert('로그인이 필요한 기능입니다. 로그인 후 이용해주세요.');
            navigate('/login');
            return;
        }

        try {
            const token = Cookies.get('accessToken');
            const saveResponse = await fetch(`${import.meta.env.VITE_Server}/api/hbti/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: userId,
                    answers: Object.values(answers)
                })
            });

            if (!saveResponse.ok) {
                throw new Error('Failed to save results');
            }
            navigate(`/quiz/${userId}/result`);
            onClose();
        } catch (error) {
            console.error('Error saving HBTI result:', error);
            alert('결과 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleRetakeQuiz = () => {
        window.location.href = '/quiz';
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {error ? (
                    <div className="error-message">
                        데이터를 불러오는데 실패했습니다: {error}
                    </div>
                ) : loading ? (
                    <div className="loading-message">Loading...</div>
                ) : (
                    <>
                        <HBTIResultDisplay hbtiData={hbtiData} />
                        
                        <button
                            onClick={handleViewDetails}
                            className="modal-button"
                        >
                            내 HBTI 자세히 보기
                        </button>
                        <span
                            onClick={handleRetakeQuiz}
                            className="retake-text"
                        >
                            퀴즈 다시 풀기
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultModal;