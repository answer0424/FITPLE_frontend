import React, { useState, useEffect } from 'react';

const QuizComponent = ({ quizData, currentPlatform, onAnswerSubmit, shouldShow }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const answerValues = [0, 20, 40, 60, 80, 100];
    
    const handleAnswerSelect = (value) => {
        setSelectedAnswer(value);
        onAnswerSubmit && onAnswerSubmit(currentPlatform, value);
    };

    useEffect(() => {
        setSelectedAnswer(null);
    }, [currentPlatform]);

    if (!shouldShow) return null;

    const containerStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '600px',
        background: 'rgba(205, 205, 205, 0.86)',
        backdropFilter: 'blur(8px)',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    const titleStyle = {
        fontSize: '1.2rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#272626'
    };

    const labelContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
    };

    const labelStyle = {
        color: '#272626',
        fontWeight: '550'
    };

    const stairsContainerStyle = {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: '128px',
        marginBottom: '2rem',
        gap: '10px'
    };

    const getStairStyle = (index, isSelected) => ({
        width: '64px',
        height: `${(index + 1) * 20}px`,
        backgroundColor: isSelected ? '#60A5FA' : '#fff',
        borderRadius:'4px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    });

    return (
        <div style={containerStyle}>
            <h3 style={titleStyle}>
                {quizData[currentPlatform]}
            </h3>
            
            <div>
                
                <div style={stairsContainerStyle}>
                    {answerValues.map((value, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(value)}
                            style={getStairStyle(index, selectedAnswer === value)}
                        />
                    ))}
                </div>
                <div style={labelContainerStyle}>
                    <span style={labelStyle}>그렇지 않다</span>
                    <span style={labelStyle}>그렇다</span>
                </div>
            </div>
        </div>
    );
};

export default QuizComponent;
