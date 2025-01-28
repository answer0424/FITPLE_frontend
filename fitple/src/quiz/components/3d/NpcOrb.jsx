import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import DogBone from './DogBone';

const ORB_SETTINGS = {
    hoverHeight: 0.5,
    oscillationSpeed: 2,
    oscillationAmplitude: 0.1,
    rotationSpeed: 0.01,
    boneRotationSpeed: 0.02,
    size: 0.3,
    segments: 32,
    color: "#00ffff",
    emissiveIntensity: 0.5,
    opacity: 0.4
};

function NPCOrb({ platformPosition }) {
    const orbRef = useRef();
    const boneRef = useRef();
    const orbPosition = [
        platformPosition[0],
        platformPosition[1] + ORB_SETTINGS.hoverHeight,
        platformPosition[2]
    ];

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        orbRef.current.position.y = platformPosition[1] + 
            ORB_SETTINGS.hoverHeight + 
            Math.sin(time * ORB_SETTINGS.oscillationSpeed) * ORB_SETTINGS.oscillationAmplitude;
        orbRef.current.rotation.y += ORB_SETTINGS.rotationSpeed;
        if (boneRef.current) {
            boneRef.current.rotation.y += ORB_SETTINGS.boneRotationSpeed;
        }
    });

    return (
        <group ref={orbRef} position={orbPosition}>
            <mesh>
                <sphereGeometry args={[ORB_SETTINGS.size, ORB_SETTINGS.segments, ORB_SETTINGS.segments]} />
                <meshStandardMaterial
                    color={ORB_SETTINGS.color}
                    emissive={ORB_SETTINGS.color}
                    emissiveIntensity={ORB_SETTINGS.emissiveIntensity}
                    transparent
                    opacity={ORB_SETTINGS.opacity}
                />
            </mesh>
            <DogBone ref={boneRef} />
        </group>
    );
}

export default NPCOrb;