import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import NPCOrb from './NpcOrb';

const PLATFORM_SETTINGS = {
    size: [2.3, 0.2, 2.3],
    activeColor: "#3B82F6",
    inactiveColor: "#828080",
    activeEmissiveIntensity: 0.8,
    inactiveEmissiveIntensity: 0.5,
    minRotationSpeed: 0.002,
    maxRotationSpeed: 0.007,
    maxHoverDistance: 0.1
};

function RotatingPlatform({ position, isActive }) {
    const meshRef = useRef();
    const rotationSpeed = useMemo(() => 
        Math.random() * (PLATFORM_SETTINGS.maxRotationSpeed - PLATFORM_SETTINGS.minRotationSpeed) + 
        PLATFORM_SETTINGS.minRotationSpeed, 
    []);
    const hoverDistance = useMemo(() => 
        Math.random() * PLATFORM_SETTINGS.maxHoverDistance, 
    []);
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
                <boxGeometry args={PLATFORM_SETTINGS.size} />
                <meshStandardMaterial
                    color={isActive ? PLATFORM_SETTINGS.activeColor : PLATFORM_SETTINGS.inactiveColor}
                    emissive={PLATFORM_SETTINGS.activeColor}
                    emissiveIntensity={isActive ? PLATFORM_SETTINGS.activeEmissiveIntensity : PLATFORM_SETTINGS.inactiveEmissiveIntensity}
                    transparent
                    opacity={1}
                />
            </mesh>
            <NPCOrb platformPosition={position} />
        </group>
    );
}

export default RotatingPlatform;