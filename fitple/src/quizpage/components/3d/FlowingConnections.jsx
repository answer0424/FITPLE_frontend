import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomLine } from '@react-three/drei';
import * as THREE from 'three';

const LINE_SETTINGS = {
    color: "#3B82F6",
    lineWidth: 120,
    defaultOpacity: 0.8,
    segments: 50,
    dashSize: 0.03,
    gapSize: 0.05
};

function FlowingConnections({ connections, currentPlatform, visibleConnections }) {
    const lineRefs = useRef([]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        lineRefs.current.forEach((ref, index) => {
            if (ref?.material) {
                const isVisible = visibleConnections.has(index) || index === currentPlatform - 1;
                if (isVisible) {
                    ref.material.dashOffset = -time;
                    ref.material.opacity = LINE_SETTINGS.defaultOpacity;
                } else {
                    ref.material.opacity = 0;
                }
            }
        });
    });

    return connections.map((connection, index) => {
        const midPoint = new THREE.Vector3().lerpVectors(
            new THREE.Vector3(...connection.start),
            new THREE.Vector3(...connection.end),
            0.5
        );
        midPoint.y += 0.2;

        return (
            <CatmullRomLine
                key={index}
                ref={el => lineRefs.current[index] = el}
                points={[
                    new THREE.Vector3(...connection.start),
                    midPoint,
                    new THREE.Vector3(...connection.end)
                ]}
                color={LINE_SETTINGS.color}
                lineWidth={LINE_SETTINGS.lineWidth}
                segments={LINE_SETTINGS.segments}
                dashed
                dashScale={1}
                dashSize={LINE_SETTINGS.dashSize}
                gapSize={LINE_SETTINGS.gapSize}
                transparent
                opacity={visibleConnections.has(index) || index === currentPlatform - 1 ? 
                    LINE_SETTINGS.defaultOpacity : 0}
            />
        );
    });
}

export default FlowingConnections;