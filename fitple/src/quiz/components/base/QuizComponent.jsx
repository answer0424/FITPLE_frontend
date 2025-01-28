import React, { useState, useEffect } from 'react';
import Modal from './Modal';

function QuizComponent({ currentPlatform, quizData, onAnswerSubmit }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hbtiResult, setHbtiResult] = useState(null);
    const [userId, setUserId] = useState(null);

    // Get user information when component mounts
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/register/user');
                if (response.ok) {
                    const userData = await response.json();
                    setUserId(userData.id);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, []);

    const answerValues = [0, 20, 40, 60, 80, 100];

    const handleAnswerSelect = (value) => {
        setSelectedAnswer(value);
        onAnswerSubmit(currentPlatform, value);
    };

    const handleResultsClick = async () => {
        if (!userId) {
            console.error('User ID not available');
            return;
        }

        try {
            const response = await fetch('/api/hbti/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    answers: Object.values(answers)
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                setHbtiResult(result);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error saving HBTI result:', error);
        }
    };

    const handleViewDetails = () => {
        if (userId) {
            window.location.href = `/hbti-detail/${userId}`;
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#333'
            }}>
                {quizData[currentPlatform]}
            </h3>
            
            <div style={{
                position: 'relative',
                marginBottom: '2rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                }}>
                    <span style={{ color: '#666' }}>그렇지 않다</span>
                    <span style={{ color: '#666' }}>그렇다</span>
                </div>
                
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {answerValues.map((value, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(value)}
                            style={{
                                width: `${24 + index * 8}px`,
                                height: `${24 + index * 8}px`,
                                borderRadius: '50%',
                                border: 'none',
                                background: selectedAnswer === value ? '#4fc3f7' : '#e2e8f0',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>
            </div>

            {currentPlatform === quizData.length - 1 && (
                <button
                    onClick={handleResultsClick}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4fc3f7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    결과보기
                </button>
            )}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                        당신의 HBTI는...
                    </h2>
                    <p style={{ fontSize: '20px', marginBottom: '24px' }}>
                        {hbtiResult?.hbtiType}
                    </p>
                    <button
                        onClick={handleViewDetails}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4fc3f7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        내 HBTI 자세히 보기
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default QuizComponent;