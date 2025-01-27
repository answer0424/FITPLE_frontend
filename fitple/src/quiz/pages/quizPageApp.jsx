import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import DogBone from '../components/DogBone';
import LowPolyDog from '../components/LowPolyDog';


const quizData = [
    "나는 무거운 덤벨을 들 때 살아있음을 느낀다.",
    "나는 숨이 벅차오를 때 까지 달릴 때 성취감을 느낀다",
    "나는 근육이 펌핑되는 기분보다 숨이 목끝까지 차오를 때 더 행복하다",
    "나는 혼자 노래들으면서 운동하는 것보다 친구랑 \"누가 더 많이 하냐\" 내기할 때 운동이 더 재미있다",
    "나는 쉬는시간에 친구들이랑 운동 얘기하는 것보다 조용이 물을 마시고 숨을 고른다",
    "나는 운동이 끝나고 바로 집으로 가는 것보다 친구들이랑 운동 얘기를 더 하고 싶다",
    "나는 여름의 가벼운 옷차림을 위해 몸을 만드는 것에 관심이 없다",
    "나는 체형 개선을 통해 자신감을 얻기보다 체력이 느는 것이 가장 중요하다",
    "나는 빼야 할 살이 없음에도 체력과 건강이 나빠졌다는 생각이 들면 운동을 해야겠다는 생각이든다.",
    "나는 운동하기 전에 운동에 대한 정보를 찾아보는 편이다",
    "나는 갑자기 친구랑 운동을 가게 되어도 내가 계획한 운동을 하는 편이다",
    "나는 갑자기 생긴 일로 운동 가기 피곤한 상황 속에서도 계획한 운동을 해야하기 때문에 운동을 간다."
];


function NPCOrb({ platformPosition }) {
    const orbRef = useRef();
    const boneRef = useRef();
    const hoverHeight = 0.5;
    const orbPosition = [
        platformPosition[0],
        platformPosition[1] + hoverHeight,
        platformPosition[2]
    ];

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        orbRef.current.position.y = platformPosition[1] + hoverHeight + Math.sin(time * 2) * 0.1;
        orbRef.current.rotation.y += 0.01;
        if (boneRef.current) {
            boneRef.current.rotation.y += 0.02;
        }
    });

    return (
        <group ref={orbRef} position={orbPosition}>
            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.4}
                />
            </mesh>
            <DogBone ref={boneRef} />
        </group>
    );
}

function DogCamera({ target, currentPath }) {
    const dogRef = useRef();
    const { camera } = useThree();
    const speed = 0.004;
    const bounceHeight = 0.1;
    const tiltAmount = 0.08;
    const runningFrequency = 8;
    const currentPosition = useRef(new THREE.Vector3());
    const pathProgress = useRef(0);
    
    useFrame((state) => {
        if (!currentPath || !dogRef.current) return;
        
        const time = state.clock.getElapsedTime();
        pathProgress.current += speed;
        
        if (pathProgress.current > 1) {
            pathProgress.current = 1;
        }

        const point = new THREE.Vector3();
        if (currentPath.length >= 2) {
            const startPoint = new THREE.Vector3(...currentPath[0]);
            const endPoint = new THREE.Vector3(...currentPath[1]);
            
            const waveAmplitude = 0.02;
            const waveFrequency = 0;
            const waveOffset = Math.sin(time * waveFrequency) * waveAmplitude;
            
            point.lerpVectors(startPoint, endPoint, pathProgress.current);
            point.y += waveOffset;
            
            const runCycle = time * runningFrequency;
            const bounce = Math.sin(runCycle) * bounceHeight;
            const tilt = Math.cos(runCycle) * tiltAmount;
            
            dogRef.current.position.copy(point);
            dogRef.current.position.y += 0.3;
            dogRef.current.position.y += bounce;
            dogRef.current.rotation.z = tilt;
            
            const direction = endPoint.clone().sub(startPoint).normalize();
            const angle = Math.atan2(direction.x, direction.z);
            dogRef.current.rotation.y = angle;

            const cameraOffset = new THREE.Vector3(3, 2 + bounce * 0.5, 4);
            const cameraTarget = point.clone().add(cameraOffset);
            camera.position.lerp(cameraTarget, 0.1);
            camera.lookAt(point);
        }
    });

    useEffect(() => {
        pathProgress.current = 0;
        if (dogRef.current && currentPath?.[0]) {
            const startPoint = new THREE.Vector3(...currentPath[0]);
            dogRef.current.position.copy(startPoint);
            dogRef.current.position.y += 0.1;
        }
    }, [currentPath]);

    return (
        <group ref={dogRef}>
            <LowPolyDog scale={[0.2, 0.2, 0.2]} />
        </group>
    );
}

function OverlayButton({ text, onClick, position, visible = true }) {
    if (!visible) return null;
    
    const buttonStyle = {
        position: 'absolute',
        padding: '10px 20px',
        backgroundColor: '#4fc3f7',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        ...position
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            onMouseEnter={e => {
                e.target.style.backgroundColor = '#00ffff';
            }}
            onMouseLeave={e => {
                e.target.style.backgroundColor = '#4fc3f7';
            }}
        >
            {text}
        </button>
    );
}

function FlowingConnections({ connections, currentPlatform, visibleConnections }) {
    const lineRefs = useRef([]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        lineRefs.current.forEach((ref, index) => {
            if (ref) {
                // Show the line if it's in the visibleConnections set or if it's the current active line
                const isVisible = visibleConnections.has(index) || index === currentPlatform - 1;
                if (isVisible) {
                    ref.material.dashOffset = -time * 0.5;
                    ref.material.opacity = 0.8;
                } else {
                    ref.material.opacity = 0;
                }
            }
        });
    });

    return connections.map((connection, index) => (
        <Line
            key={index}
            ref={el => lineRefs.current[index] = el}
            points={[connection.start, connection.end]}
            color="#4fc3f7"
            lineWidth={80}
            dashed
            dashScale={50}
            dashSize={3}
            dashOffset={0}
            transparent
            opacity={visibleConnections.has(index) || index === currentPlatform - 1 ? 0.8 : 0}
        />
    ));
}


function ConnectedPlatforms({ platformPositions, currentPlatform, visibleConnections }) {
    const connections = useMemo(() => {
        const lines = [];
        for (let i = 0; i < platformPositions.length - 1; i++) {
            lines.push({
                start: platformPositions[i],
                end: platformPositions[i + 1]
            });
        }
        return lines;
    }, [platformPositions]);

    return (
        <group>
            {platformPositions.map((pos, index) => (
                <RotatingPlatform
                    key={index}
                    position={pos}
                    isActive={index === currentPlatform}
                />
            ))}
            <FlowingConnections 
                connections={connections} 
                currentPlatform={currentPlatform}
                visibleConnections={visibleConnections}
            />
        </group>
    );
}

function RotatingPlatform({ position, isActive }) {
    const meshRef = useRef();
    const rotationSpeed = useMemo(() => Math.random() * 0.005 + 0.002, []);
    const hoverDistance = useMemo(() => Math.random() * 0.1, []);
    const initialY = position[1];

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.y += rotationSpeed;
        meshRef.current.position.y = initialY + Math.sin(time) * hoverDistance;
    });

    return (
        <group>
            <mesh
                ref={meshRef}
                position={position}
            >
                <boxGeometry args={[2, 0.2, 2]} />
                <meshStandardMaterial
                    color={isActive ? "#4fc3f7" : "#FFFFFF"}
                    emissive={isActive ? "#4fc3f7" : "#4fc3f7"}
                    emissiveIntensity={isActive ? 0.8 : 0.5}
                    transparent
                    opacity={1}
                />
            </mesh>
            <NPCOrb platformPosition={position} />
        </group>
    );
}

function UIOverlay({ currentPlatform, totalPlatforms, onNext, onPrev, onStart, onFinish, gameState }) {
    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none' 
        }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <OverlayButton
                    text="START"
                    position={{ 
                        left: '50%', 
                        top: '50%', 
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'auto'
                    }}
                    onClick={onStart}
                    visible={gameState === 'initial'}
                />
                <OverlayButton
                    text="다음으로"
                    position={{ 
                        right: '40px', 
                        bottom: '40px',
                        pointerEvents: 'auto'
                    }}
                    onClick={onNext}
                    visible={gameState === 'playing' && currentPlatform < totalPlatforms - 1}
                />
                <OverlayButton
                    text="이전으로"
                    position={{ 
                        left: '40px', 
                        bottom: '40px',
                        pointerEvents: 'auto'
                    }}
                    onClick={onPrev}
                    visible={gameState === 'playing' && currentPlatform > 0}
                />
                <OverlayButton
                    text="결과보기"
                    position={{ 
                        left: '50%', 
                        top: '40px', 
                        transform: 'translate(-50%, 0)',
                        pointerEvents: 'auto'
                    }}
                    onClick={onFinish}
                    visible={gameState === 'playing' && currentPlatform === totalPlatforms - 1}
                />
            </div>
        </div>
    );
}

function MainApp() {
    const [gameState, setGameState] = useState('initial');
    const [currentPlatform, setCurrentPlatform] = useState(0);
    const [currentPath, setCurrentPath] = useState(null);
    const [visibleConnections, setVisibleConnections] = useState(new Set());
    const [answers, setAnswers] = useState({});

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

    const handleFinish = () => {
        if (Object.keys(answers).length < quizData.length) {
            alert('Please answer all questions before finishing.');
            return;
        }
        setGameState('finished');
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
                
                <ConnectedPlatforms 
                    platformPositions={platformPositions}
                    currentPlatform={currentPlatform}
                    visibleConnections={visibleConnections}
                />
                <DogCamera currentPath={currentPath} />
            </Canvas>
            
            {/* Quiz Overlay */}
            {gameState === 'playing' && currentPlatform < quizData.length && (
                <div 
                    style={{
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
                    }}
                >
                    <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: '#333'
                    }}>
                        {quizData[currentPlatform]}
                    </h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px'
                    }}>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                onClick={() => handleAnswerChange(currentPlatform, value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: answers[currentPlatform] === value ? '#4fc3f7' : '#e2e8f0',
                                    color: answers[currentPlatform] === value ? 'white' : '#333',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    flex: 1,
                                    fontWeight: '500'
                                }}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
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

export default MainApp;

