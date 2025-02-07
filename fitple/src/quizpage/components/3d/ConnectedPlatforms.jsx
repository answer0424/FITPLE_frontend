import React, { useMemo } from 'react';
import RotatingPlatform from './RotatingPlatform';
import FlowingConnections from './FlowingConnections';
import NPCOrb from './NpcOrb';

function ConnectedPlatforms({ 
    platformPositions, 
    currentPlatform, 
    visibleConnections,
    npcCompletedPlatforms,
    currentNPCVisibility
}) {
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

    console.log('ConnectedPlatforms render, platform:', currentPlatform);

    return (
        <group name="connected-platforms">
            {platformPositions.map((pos, index) => (
                <group key={index}>
                    <RotatingPlatform
                        position={pos}
                        isActive={index === currentPlatform}
                    />
                    {!npcCompletedPlatforms.has(index) && 
                     index !== platformPositions.length - 1 && (
                        <NPCOrb 
                            platformPosition={pos}
                            isActive={index === currentPlatform ? currentNPCVisibility : true}
                        />
                    )}
                </group>
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