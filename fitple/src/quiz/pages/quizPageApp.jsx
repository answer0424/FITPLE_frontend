import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import DogBone from '../components/DogBone';

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
        // Orb hovering animation
        orbRef.current.position.y = platformPosition[1] + hoverHeight + Math.sin(time * 2) * 0.1;

        // Rotate both orb and bone
        orbRef.current.rotation.y += 0.01;
        if (boneRef.current) {
            boneRef.current.rotation.y += 0.02;
        }
    });

    return (
        <group ref={orbRef} position={orbPosition}>
            {/* Orb mesh */}
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
            {/* Dog bone inside the orb */}
            <DogBone ref={boneRef} />
        </group>
    );
}

// Rest of your components remain the same
function CameraController({ target }) {
    const { camera } = useThree();
    const controls = useRef();
    const isMoving = useRef(false);
    const lerpComplete = useRef(false);

    useFrame(() => {
        if (target && !lerpComplete.current) {
            isMoving.current = true;
            const targetVector = new THREE.Vector3(...target);
            const currentPosition = new THREE.Vector3().copy(camera.position);
            const targetPosition = targetVector.clone().add(new THREE.Vector3(2, 2, 2));

            const distanceToTarget = currentPosition.distanceTo(targetPosition);

            if (distanceToTarget < 0.1) {
                lerpComplete.current = true;
                isMoving.current = false;
                return;
            }

            camera.position.lerp(targetPosition, 0.05);
            controls.current.target.lerp(targetVector, 0.05);
        }
    });

    React.useEffect(() => {
        if (target) {
            lerpComplete.current = false;
        }
    }, [target]);

    return (
        <OrbitControls
            ref={controls}
            enableRotate={!isMoving.current}
            enableZoom={!isMoving.current}
            enablePan={!isMoving.current}
        />
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
                    color="#ffffff"
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
                <CameraController target={targetPosition} />
            </Canvas>
        </div>
    );
}

export default MainApp;