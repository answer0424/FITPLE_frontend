import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

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
          // Save HBTI result
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
            console.log(saveResponse.headers.get('content-type'));

          if (!saveResponse.ok) {
              throw new Error('Failed to save results');
          }

          // Navigate to detailed view
          navigate(`/quiz/${userId}/result`);
          onClose();
      } catch (error) {
          console.error('Error saving HBTI result:', error);
          alert('결과 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
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
                  <div style={{ color: 'red', textAlign: 'center' }}>
                      데이터를 불러오는데 실패했습니다: {error}
                  </div>
              ) : loading ? (
                  <div style={{ textAlign: 'center' }}>Loading...</div>
              ) : (
                  <>
                      <h2 style={titleStyle}>나의 HBTI는</h2>
                      <h1 style={titleStyle}>{hbtiData?.hbtiType}</h1>
                      {hbtiData?.dogImage && (
                          <img
                              src={`${import.meta.env.VITE_Server}${hbtiData.dogImage}`}
                              alt="HBTI Type"
                              style={imageStyle}
                          />
                      )}
                      <h3 style={subtitleStyle}>{hbtiData?.label}</h3>
                      <button
                          onClick={handleViewDetails}
                          style={buttonStyle}
                      >
                          내 HBTI 자세히 보기 
                          {!userId && ' (회원가입 필요)'}
                      </button>
                  </>
              )}
          </div>
      </div>
  );
};

export default ResultModal;