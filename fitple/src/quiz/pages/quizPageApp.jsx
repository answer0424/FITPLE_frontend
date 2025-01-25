import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
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



function DogCamera({ target }) {
    const dogRef = useRef();
    const { camera } = useThree();
    const speed = 0.1;
    const bounceHeight = 0.2;
    const tiltAmount = 0.1;
    const runningFrequency = 8;
    const currentPosition = useRef(new THREE.Vector3());
    const velocity = useRef(new THREE.Vector3());
    
    useFrame((state) => {
        if (!target || !dogRef.current) return;
        
        const time = state.clock.getElapsedTime();
        const targetVector = new THREE.Vector3(...target);
        
        // Calculate direction and distance
        const direction = targetVector.clone().sub(currentPosition.current).normalize();
        const distance = currentPosition.current.distanceTo(targetVector);
        
        if (distance > 0.1) {
            // Accelerate towards target
            velocity.current.lerp(direction.multiplyScalar(speed), 0.05);
            currentPosition.current.add(velocity.current);
            
            // Running animation
            const runCycle = time * runningFrequency;
            const bounce = Math.sin(runCycle) * bounceHeight;
            const tilt = Math.cos(runCycle) * tiltAmount;
            
            // Apply animations
            dogRef.current.position.copy(currentPosition.current);
            dogRef.current.position.y += bounce;
            dogRef.current.rotation.z = tilt;
            
            // Face movement direction
            const angle = Math.atan2(velocity.current.x, velocity.current.z);
            dogRef.current.rotation.y = angle;
            
            // Camera follows with momentum
            const cameraOffset = new THREE.Vector3(3, 2 + bounce * 0.5, 4);
            const cameraTarget = currentPosition.current.clone().add(cameraOffset);
            camera.position.lerp(cameraTarget, 0.05);
            camera.lookAt(currentPosition.current);
        }
    });

    // Initialize position
    React.useEffect(() => {
        if (!dogRef.current) return;
        currentPosition.current.copy(dogRef.current.position);
    }, []);

    return (
        <group ref={dogRef}>
            <LowPolyDog scale={[0.4, 0.4, 0.4]} />
        </group>
    );
}

function RotatingPlatform({ position, onPlatformClick }) {
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
                onClick={(e) => {
                    e.stopPropagation();
                    onPlatformClick(position);
                }}
                onPointerEnter={() => document.body.style.cursor = 'pointer'}
                onPointerLeave={() => document.body.style.cursor = 'default'}
            >
                <boxGeometry args={[2, 0.2, 2]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    emissive="#4fc3f7"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.9}
                />
            </mesh>
            <NPCOrb platformPosition={position} />
        </group>
    );
}

function FlowingConnections({ connections }) {
    const lineRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (lineRef.current) {
            lineRef.current.material.dashOffset = -time * 0.5;
        }
    });

    return connections.map((connection, index) => (
        <Line
            key={index}
            ref={lineRef}
            points={[connection.start, connection.end]}
            color="#4fc3f7"
            lineWidth={2}
            dashed
            dashScale={50}
            dashSize={0.5}
            dashOffset={0}
            transparent
            opacity={0.6}
        />
    ));
}

function ConnectedPlatforms({ onPlatformClick }) {
    const platformPositions = useMemo(() => {
        const positions = [];
        for (let i = 0; i < 15; i++) {
            positions.push([
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30
            ]);
        }
        return positions;
    }, []);

    const connections = useMemo(() => {
        const lines = [];
        for (let i = 0; i < platformPositions.length - 1; i++) {
            lines.push({
                start: platformPositions[i],
                end: platformPositions[i + 1]
            });
        }
        lines.push({
            start: platformPositions[platformPositions.length - 1],
            end: platformPositions[0]
        });
        return lines;
    }, [platformPositions]);

    return (
        <group>
            {platformPositions.map((pos, index) => (
                <RotatingPlatform
                    key={index}
                    position={pos}
                    onPlatformClick={onPlatformClick}
                />
            ))}
            <FlowingConnections connections={connections} />
        </group>
    );
}

function MainApp() {
    const [targetPosition, setTargetPosition] = useState(null);

    const handlePlatformClick = (position) => {
        setTargetPosition(position);
    };

    return (
        <div style={{ width: "100vw", height: "100vh", background: "#000000" }}>
            <Canvas camera={{ position: [0, 0, 40], fov: 60 }}>
                <color attach="background" args={["#000000"]} />
                <fog attach="fog" args={["#000000", 30, 90]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <ConnectedPlatforms onPlatformClick={handlePlatformClick} />
                <DogCamera target={targetPosition} />
            </Canvas>
        </div>
    );
}

export default MainApp;