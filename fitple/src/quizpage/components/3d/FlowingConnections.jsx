import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

const LINE_SETTINGS = {
    color: "#4fc3f7",
    lineWidth: 80,
    dashScale: 50,
    dashSize: 3,
    defaultOpacity: 0.8
};

function FlowingConnections({ connections, currentPlatform, visibleConnections }) {
    const lineRefs = useRef([]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        lineRefs.current.forEach((ref, index) => {
            if (ref) {
                const isVisible = visibleConnections.has(index) || index === currentPlatform - 1;
                if (isVisible) {
                    ref.material.dashOffset = -time * 0.5;
                    ref.material.opacity = LINE_SETTINGS.defaultOpacity;
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
            {...LINE_SETTINGS}
            dashed
            dashOffset={0}
            transparent
            opacity={visibleConnections.has(index) || index === currentPlatform - 1 ? LINE_SETTINGS.defaultOpacity : 0}
        />
    ));
}

export default FlowingConnections;