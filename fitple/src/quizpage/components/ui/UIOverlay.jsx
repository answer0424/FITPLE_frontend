import React from 'react';
import OverlayButton from './OverlayButton';

function UIOverlay({ currentPlatform, totalPlatforms, onNext, onPrev, onStart, onFinish, gameState }) {
    
    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none' 
        }}>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <OverlayButton
                    text="HBTI 퀴즈 풀기"
                    position={{ 
                        left: '50%', 
                        top: '50%', 
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'auto'
                    }}
                    onClick={onStart}
                    visible={gameState === 'initial'}
                />
                <OverlayButton
                    text="다음으로"
                    position={{ 
                        right: '40px', 
                        bottom: '40px',
                        pointerEvents: 'auto'
                    }}
                    onClick={onNext}
                    visible={gameState === 'playing' && currentPlatform < totalPlatforms - 1}
                />
                <OverlayButton
                    text="이전으로"
                    position={{ 
                        left: '40px', 
                        bottom: '40px',
                        pointerEvents: 'auto'
                    }}
                    onClick={onPrev}
                    visible={gameState === 'playing' && currentPlatform > 0}
                />
                <OverlayButton
                    text="결과보기"
                    position={{ 
                        left: '50%', 
                        top: '40px', 
                        transform: 'translate(-50%, 0)',
                        pointerEvents: 'auto'
                    }}
                    onClick={onFinish}
                    visible={gameState === 'playing' && currentPlatform === totalPlatforms - 1}
                />
            </div>
        </div>
    );
}

export default UIOverlay;