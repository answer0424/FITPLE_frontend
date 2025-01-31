import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import GameScene from '../components/3d/GameScene';
import QuizComponent from '../components/base/QuizComponent'
import UIOverlay from '../components/ui/UIOverlay';
import quizData from '../components/data/quizData';
import { ResultModal} from '../components/ui/ResultModal';

function QuizPage() {
    const [gameState, setGameState] = useState('initial');
    const [currentPlatform, setCurrentPlatform] = useState(0);
    const [currentPath, setCurrentPath] = useState(null);
    const [visibleConnections, setVisibleConnections] = useState(new Set());
    const [answers, setAnswers] = useState({});
    const [userId, setUserId] = useState(null);
    const [showQuiz, setShowQuiz] = useState(true);
    const [showResultModal, setShowResultModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/register/user');
                if (response.ok) {
                    const userData = await response.json();
                    setUserId(userData.id);
                    console.log('User ID:', userData.id); 
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
        if (answers[currentPlatform] === undefined) {
            alert('다음 문제로 넘어가기 전에 해당 질문에 대한 답을 해주세요 .');
            return;
        }
        
        setShowQuiz(false);
        const nextPlatform = currentPlatform + 1;
        if (nextPlatform < platformPositions.length) {
            setCurrentPlatform(nextPlatform);
            setCurrentPath([platformPositions[currentPlatform], platformPositions[nextPlatform]]);
            setVisibleConnections(prev => {
                const newSet = new Set(prev);
                newSet.add(currentPlatform);
                return newSet;
            });
            setTimeout(() => setShowQuiz(true), 100);
        }
    };

    const handlePrev = () => {
        setShowQuiz(false);
        const prevPlatform = currentPlatform - 1;
        if (prevPlatform >= 0) {
            setCurrentPlatform(prevPlatform);
            setCurrentPath([platformPositions[currentPlatform], platformPositions[prevPlatform]]);
            setTimeout(() => setShowQuiz(true), 100);
        }
    };

    const handleFinish = async () => {
        if (!userId) {
            console.error('회원이 아닙니다. 회원가입 후 다시 시도해주세요.');
            return;
        }

        if (Object.keys(answers).length < quizData.length) {
            alert('모든 문제를 해결 후, 결과보기 버튼을 클릭해주세요');
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
                setShowResultModal(true);
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
                    shouldShow={showQuiz}
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
            {showResultModal && (
                <ResultModal
                    isOpen={showResultModal}
                    onClose={() => setShowResultModal(false)}
                    userId={userId}
                />
            )}
        </div>
    );
}

export default QuizPage;