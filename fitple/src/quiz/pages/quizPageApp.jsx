import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import DogBone from '../components/DogBone';
import LowPolyDog from '../components/LowPolyDog';

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
    const speed = 0.005;
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

function FlowingConnections({ connections, showIndex, isPathVisible }) {
    const lineRefs = useRef([]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        lineRefs.current.forEach((ref, index) => {
            if (ref && index === showIndex && isPathVisible) {
                ref.material.dashOffset = -time * 0.5;
                ref.material.opacity = 0.8;
            } else if (ref) {
                ref.material.opacity = 0;
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
            opacity={index === showIndex && isPathVisible ? 0.8 : 0}
        />
    ));
}

function ConnectedPlatforms({ platformPositions, currentPlatform, isPathVisible }) {
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
                showIndex={currentPlatform - 1}
                isPathVisible={isPathVisible} 
            />
        </group>
    );
}

function RotatingPlatform({ position, isActive }) {
    const meshRef = useRef();
    const rotationSpeed = useMemo(() => Math.random() * 0.005 + 0.002, []);
    const hoverDistance = useMemo(() => Math.random() * 0.3, []);
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
    const [isPathVisible, setIsPathVisible] = useState(false);
    const pathVisibilityTimeout = useRef(null);
    
    const platformPositions = useMemo(() => {
        const positions = [];
        for (let i = 0; i < 12; i++) {
            positions.push([
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 20
            ]);
        }
        return positions;
    }, []);

    const handleStart = () => {
        setGameState('playing');
        setCurrentPath([platformPositions[0], platformPositions[0]]);
    };

    const handleNext = () => {
        const nextPlatform = currentPlatform + 1;
        if (nextPlatform < platformPositions.length) {
            if (pathVisibilityTimeout.current) {
                clearTimeout(pathVisibilityTimeout.current);
            }
            
            setIsPathVisible(true);
            
            pathVisibilityTimeout.current = setTimeout(() => {
                setIsPathVisible(false);
            }, 20000);
            
            setCurrentPlatform(nextPlatform);
            setCurrentPath([platformPositions[currentPlatform], platformPositions[nextPlatform]]);
        }
    };

    const handlePrev = () => {
        const prevPlatform = currentPlatform - 1;
        if (prevPlatform >= 0) {
            if (pathVisibilityTimeout.current) {
                clearTimeout(pathVisibilityTimeout.current);
            }
            
            setIsPathVisible(true);
            
            pathVisibilityTimeout.current = setTimeout(() => {
                setIsPathVisible(false);
            }, 2000);
            
            setCurrentPlatform(prevPlatform);
            setCurrentPath([platformPositions[currentPlatform], platformPositions[prevPlatform]]);
        }
    };

    const handleFinish = () => {
        setGameState('finished');
    };

    useEffect(() => {
        return () => {
            if (pathVisibilityTimeout.current) {
                clearTimeout(pathVisibilityTimeout.current);
            }
        };
    }, []);

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
                    isPathVisible={isPathVisible}
                />
                <DogCamera currentPath={currentPath} />
            </Canvas>
            
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