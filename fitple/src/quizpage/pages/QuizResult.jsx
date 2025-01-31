import React from 'react';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ResultModal component to show immediate results
const ResultModal = ({ isOpen, onClose, userId }) => {
  const [hbtiData, setHbtiData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHbtiResult = async () => {
      try {
        const response = await fetch(`/api/hbti/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch HBTI result');
        const data = await response.json();
        setHbtiData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId && isOpen) {
      fetchHbtiResult();
    }
  }, [userId, isOpen]);

  const handleViewDetails = () => {
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
    padding: '24px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : !hbtiData ? (
          <div style={{ textAlign: 'center' }}>Loading...</div>
        ) : (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your HBTI Result</h2>
            {hbtiData.imageUrl && (
              <div style={{ width: '100%', aspectRatio: '1', marginBottom: '20px' }}>
                <img
                  src={hbtiData.imageUrl}
                  alt="HBTI Type"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '10px' }}>{hbtiData.type}</h3>
              <p style={{ color: '#666' }}>{hbtiData.shortDescription}</p>
            </div>
            <button style={buttonStyle} onClick={handleViewDetails}>
              View Detailed Results
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizResult;