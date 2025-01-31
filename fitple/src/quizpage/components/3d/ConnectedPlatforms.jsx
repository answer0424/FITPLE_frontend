import React, { useMemo } from 'react';
import RotatingPlatform from './RotatingPlatform';
import FlowingConnections from './FlowingConnections';


/**
 * ConnectedPlatforms - 플랫폼들과 그들을 연결하는 선들을 렌더링하는 컴포넌트
 * {Array} platformPositions - 각 플랫폼의 3D 위치 좌표 배열
 * {number} currentPlatform - 현재 활성화된 플랫폼의 인덱스
 * {Set} visibleConnections - 보여질 연결선들의 인덱스 집합
 */

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
        <group name="connected-platforms">
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

export default ConnectedPlatforms;