import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResultModal = ({ isOpen, onClose, userId }) => {
    const [hbtiData, setHbtiData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHbtiData = async () => {
            try {
                console.log('Fetching from:', `${import.meta.env.VITE_SERVER}/api/hbti/type/MECP`);
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER}/api/hbti/type/MECP`
                );
                console.log()
                setHbtiData(response.data);
                setLoading(false);
                console.log("HBTI 데이터 로드 성공:", response.data);
            } catch (err) {
                console.error("HBTI 데이터 로드 실패:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchHbtiData();
        }
    }, [isOpen]);

    const handleViewDetails = () => {
        if (!userId) {
            alert('회원가입이 필요한 기능입니다. 회원가입 후 이용해주세요.');
            return;
        }
        navigate(`/quiz/${userId}/result`);
        onClose();
    };

    if (!isOpen) return null;

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000
    };

    const contentStyle = {
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
    };

    const titleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '24px',
        color: '#333'
    };

    const imageStyle = {
        width: '100%',
        maxHeight: '300px',
        objectFit: 'contain',
        marginBottom: '24px'
    };

    const subtitleStyle = {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#444',
        textAlign: 'center'
    };

    const descriptionStyle = {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#666',
        marginBottom: '24px',
        textAlign: 'center'
    };

    const buttonStyle = {
        width: '100%',
        padding: '14px 20px',
        backgroundColor: '#4a90e2',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginTop: '16px'
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={contentStyle} onClick={e => e.stopPropagation()}>
                {error ? (
                    <div style={{ color: 'red', textAlign: 'center' }}>데이터를 불러오는데 실패했습니다: {error}</div>
                ) : loading ? (
                    <div style={{ textAlign: 'center' }}>Loading...</div>
                ) : (
                    <>
                        <h2 style={titleStyle}>당신의 HBTI 결과</h2>
                        {hbtiData?.dogImage && (
                            <img
                              src={`${import.meta.env.VITE_SERVER}${hbtiData.dogImage}`}
                              alt="HBTI Type"
                              style={imageStyle}
                            />
                        )}
                        <h3 style={subtitleStyle}>{hbtiData?.label}</h3>
                        <p style={descriptionStyle}>{hbtiData?.description}</p>
                        <button
                            onClick={handleViewDetails}
                            style={buttonStyle}
                        >
                            내 HBTI 자세히 보기 
                            {/* {!userId && '(회원가입 필요)'} */}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultModal;