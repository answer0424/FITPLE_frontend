import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import LowPolyDog from './LowPolyDog';

const CAMERA_SETTINGS = {
    speed: 0.004,
    bounceHeight: 0.1,
    tiltAmount: 0.08,
    runningFrequency: 8,
    waveAmplitude: 0.02,
    waveFrequency: 0,
    dogBaseHeight: 0.3,
    cameraOffset: new THREE.Vector3(3, 2, 3),
    cameraLerpSpeed: 0.1
};

/**
 * DogCamera - 3D 공간에서 강아지 모델과 카메라 움직임을 제어하는 컴포넌트
 * {Array} currentPath - 현재 이동 경로의 시작점과 끝점 좌표
 */

function DogCamera({ currentPath, onArrival }) {
    const dogRef = useRef();
    const { camera } = useThree();
    const currentPosition = useRef(new THREE.Vector3());
    const pathProgress = useRef(0);
    const arrived = useRef(false);
    
    useFrame((state) => {
        if (!currentPath || !dogRef.current) return;
        
        const time = state.clock.getElapsedTime();
        pathProgress.current += CAMERA_SETTINGS.speed;
        
        if (pathProgress.current >= 1) {
            pathProgress.current = 1;

            if (!arrived.current) {
                arrived.current = true;
                onArrival && onArrival();
            }
        }

        const point = new THREE.Vector3();
        if (currentPath.length >= 2) {
            const startPoint = new THREE.Vector3(...currentPath[0]);
            const endPoint = new THREE.Vector3(...currentPath[1]);
            
            const waveOffset = Math.sin(time * CAMERA_SETTINGS.waveFrequency) * CAMERA_SETTINGS.waveAmplitude;
            
            point.lerpVectors(startPoint, endPoint, pathProgress.current);
            point.y += waveOffset;
            
            const runCycle = time * CAMERA_SETTINGS.runningFrequency;
            const bounce = Math.sin(runCycle) * CAMERA_SETTINGS.bounceHeight;
            const tilt = Math.cos(runCycle) * CAMERA_SETTINGS.tiltAmount;
            
            dogRef.current.position.copy(point);
            dogRef.current.position.y += CAMERA_SETTINGS.dogBaseHeight + bounce;
            dogRef.current.rotation.z = tilt;
            
            const direction = endPoint.clone().sub(startPoint).normalize();
            const angle = Math.atan2(direction.x, direction.z);
            dogRef.current.rotation.y = angle;

            const cameraTarget = point.clone().add(CAMERA_SETTINGS.cameraOffset.clone().setY(CAMERA_SETTINGS.cameraOffset.y + bounce * 0.5));
            camera.position.lerp(cameraTarget, CAMERA_SETTINGS.cameraLerpSpeed);
            camera.lookAt(point);
        }
    });

    useEffect(() => {
        arrived.current = false;
    }, [currentPath]);

    useEffect(() => {
        pathProgress.current = 0;
        if (dogRef.current && currentPath?.[0]) {
            const startPoint = new THREE.Vector3(...currentPath[0]);
            dogRef.current.position.copy(startPoint);
            dogRef.current.position.y += CAMERA_SETTINGS.dogBaseHeight;
        }
    }, [currentPath]);

    return (
        <group ref={dogRef}>
            <LowPolyDog scale={[0.27, 0.27, 0.27]} />
        </group>
    );
}

export default DogCamera;