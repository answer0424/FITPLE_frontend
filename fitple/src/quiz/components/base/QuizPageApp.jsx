import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import GameScene from '../3d/GameScene';
import QuizComponent from './QuizComponent'
import UIOverlay from '../ui/UIOverlay';
import quizData from '../data/quizData';

function QuizPageApp() {
    const [gameState, setGameState] = useState('initial');
    const [currentPlatform, setCurrentPlatform] = useState(0);
    const [currentPath, setCurrentPath] = useState(null);
    const [visibleConnections, setVisibleConnections] = useState(new Set());
    const [answers, setAnswers] = useState({});
    const [userId, setUserId] = useState(null);

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

    const platformPositions = useMemo(() => {
        const positions = [];
        const platformCount = 13;
        const heightStep = 5;
        const radius = 16;
        
        for (let i = 0; i < platformCount; i++) {
            const angle = (i / platformCount) * Math.PI * 16;
            positions.push([
                Math.sin(angle) * (radius * 0.5),
                i * heightStep,
                Math.cos(angle) * (radius * 0.5)
            ]);
        }
        
        return positions.sort((a, b) => a[1] - b[1]);
    }, []);


    const handleStart = () => {
        setGameState('playing');
        setCurrentPath([platformPositions[0], platformPositions[0]]);
        setVisibleConnections(new Set());
    };

    const handleNext = () => {
        if (!answers[currentPlatform] && currentPlatform < quizData.length) {
            alert('Please answer the current question before proceeding.');
            return;
        }
        
        const nextPlatform = currentPlatform + 1;
        if (nextPlatform < platformPositions.length) {
            setCurrentPlatform(nextPlatform);
            setCurrentPath([platformPositions[currentPlatform], platformPositions[nextPlatform]]);
            setVisibleConnections(prev => {
                const newSet = new Set(prev);
                newSet.add(currentPlatform);
                return newSet;
            });
        }
    };

    const handlePrev = () => {
        const prevPlatform = currentPlatform - 1;
        if (prevPlatform >= 0) {
            setCurrentPlatform(prevPlatform);
            setCurrentPath([platformPositions[currentPlatform], platformPositions[prevPlatform]]);
        }
    };

    const handleFinish = async () => {
        if (!userId) {
            console.error('User ID not available');
            return;
        }

        if (Object.keys(answers).length < quizData.length) {
            alert('Please answer all questions before finishing.');
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
                setGameState('finished');
            }
        } catch (error) {
            console.error('Error saving HBTI result:', error);
        }
    };

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
    };

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#000000", position: 'relative' }}>
            <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
                <color attach="background" args={["#000000"]} />
                <fog attach="fog" args={["#000000", 30, 90]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <GameScene
                    currentPlatform={currentPlatform}
                    currentPath={currentPath}
                    visibleConnections={visibleConnections}
                    platformPositions={platformPositions}
                />
            </Canvas>
            
            {gameState === 'playing' && currentPlatform < quizData.length && (
                <QuizComponent 
                    currentPlatform={currentPlatform}
                    quizData={quizData}
                    onAnswerSubmit={handleAnswerChange}
                />
            )}
            
            <UIOverlay
                currentPlatform={currentPlatform}
                totalPlatforms={platformPositions.length}
                onNext={handleNext}
                onPrev={handlePrev}
                onStart={handleStart}
                onFinish={handleFinish}
                gameState={gameState}
            />
        </div>
    );
}

export default QuizPageApp;