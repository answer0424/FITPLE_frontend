import React from 'react';
import ConnectedPlatforms from './ConnectedPlatforms';
import DogCamera from './DogCamera';

function GameScene({ 
    currentPlatform, 
    currentPath, 
    visibleConnections, 
    platformPositions,
    completedPlatforms,
    onDogArrival
}) {
    
    return (
        <>
            {/* Scene Lighting */}
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 30, 90]} />
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            {/* Game Elements */}
            <ConnectedPlatforms 
                platformPositions={platformPositions}
                currentPlatform={currentPlatform}
                visibleConnections={visibleConnections}
                completedPlatforms={completedPlatforms}
            />
            <DogCamera 
                currentPath={currentPath} 
                onArrival={onDogArrival}
            />
        </>
    ); 
}

export default GameScene;