import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import Cookies from 'js-cookie';
import GameScene from '../components/3d/GameScene';
import QuizComponent from '../components/base/QuizComponent';
import UIOverlay from '../components/ui/UIOverlay';
import quizData from '../components/data/quizData';
import ResultModal from '../components/ui/ResultModal';

function QuizPage() {
    const [gameState, setGameState] = useState('initial');
    const [currentPlatform, setCurrentPlatform] = useState(0);
    const [currentPath, setCurrentPath] = useState(null);
    const [visibleConnections, setVisibleConnections] = useState(new Set());
    const [answers, setAnswers] = useState({});
    const [userId, setUserId] = useState(null);
    const [showQuiz, setShowQuiz] = useState(true);
    const [showResultModal, setShowResultModal] = useState(false);
    const [hbtiType, setHbtiType] = useState(null);
    const [isMoving, setIsMoving] = useState(false);
    const [pathCompleted, setPathCompleted] = useState(new Set());
    const [npcCompletedPlatforms, setNpcCompletedPlatforms] = useState(new Set());
    const [currentNPCVisibility, setCurrentNPCVisibility] = useState(true);

    const handleDogArrival = () => {
        setIsMoving(false);
        setTimeout(() => {
            setShowQuiz(true);
        }, 100);
    };

    const handleQuizComplete = () => {
        setCurrentNPCVisibility(false);
        setNpcCompletedPlatforms(prev => {
            const newCompleted = new Set(prev);
            newCompleted.add(currentPlatform);
            return newCompleted;
        });

        setPathCompleted(prev => {
            const newPathCompleted = new Set(prev);
            newPathCompleted.add(currentPlatform);
            return newPathCompleted;
        });
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get('accessToken');
                
                if (!token) {
                    console.log('No token found in cookies');
                    return;
                }
         
                const response = await fetch(`${import.meta.env.VITE_Server}/register/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
         
                console.log('Response status:', response.status);
                
                if (response.ok) {
                    const userData = await response.json();
                    console.log('User data received:', userData);
                    
                    if (userData.id) {
                        setUserId(userData.id);
                        console.log('User ID set:', userData.id);
                    }
                } else {
                    console.log('Response not OK:', response.statusText);
                    if (response.status === 401 || response.status === 403) {
                        Cookies.remove('accessToken');
                    }
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
        setIsMoving(true);
    
        const nextPlatform = currentPlatform + 1;
        if (nextPlatform < platformPositions.length) {
            setCurrentPlatform(nextPlatform);
            setCurrentPath([platformPositions[currentPlatform], platformPositions[nextPlatform]]);
            setVisibleConnections(prev => {
                const newSet = new Set(prev);
                newSet.add(currentPlatform);
                return newSet;
            });
            setCurrentNPCVisibility(true);
        }
    };

    const handlePrev = () => {
        setShowQuiz(false);
        setIsMoving(true);

        const prevPlatform = currentPlatform - 1;
        if (prevPlatform >= 0) {
            setCurrentPlatform(prevPlatform);
            setCurrentPath([platformPositions[currentPlatform], platformPositions[prevPlatform]]);
        }
    };

    const handleFinish = async () => {
        console.log("handleFinish called");
        if (Object.keys(answers).length < quizData.length) {
            alert('모든 문제를 해결 후, 결과보기 버튼을 클릭해주세요');
            return;
        }
    
        const answersArray = Object.values(answers);
        console.log('Sending answers:', answersArray);
    
        try {
            const response = await fetch(`${import.meta.env.VITE_Server}/api/hbti/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(answersArray)
            });
            console.log(response.headers.get('content-type'));
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error('Failed to calculate HBTI type');
            }
    
            const result = await response.json();
            console.log('Received result:', result); // Add this log
            setHbtiType(result.hbtiType);
            setGameState('finished');
            setShowResultModal(true);
            
        } catch (error) {
            console.error('Error calculating HBTI:', error);
            alert('HBTI 계산 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleAnswerChange = (questionIndex, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: value
        }));
        handleQuizComplete();
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
                    pathCompleted={pathCompleted}
                    npcCompletedPlatforms={npcCompletedPlatforms}
                    currentNPCVisibility={currentNPCVisibility}
                    onDogArrival={handleDogArrival}
                />
            </Canvas>
            
            {!isMoving && showQuiz && gameState === 'playing' && currentPlatform < quizData.length && (
                <QuizComponent 
                    currentPlatform={currentPlatform}
                    quizData={quizData}
                    onAnswerSubmit={handleAnswerChange}
                    shouldShow={true}
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
                hbtiType={hbtiType}
                answers={answers}
            />
            )}
        </div>
    );
}

export default QuizPage;