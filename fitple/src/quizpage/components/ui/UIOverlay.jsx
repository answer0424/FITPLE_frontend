import React from 'react';
import './OverlayButton.css';

function UIOverlay({ currentPlatform, totalPlatforms, onNext, onPrev, onStart, onFinish, gameState }) {
    return (
        <div className="overlay-container">
            <div className="overlay-content">
                {gameState === 'initial' && (
                    <button 
                        className="button-base start-button"
                        style={{ 
                            position: 'absolute',
                            left: '50%', 
                            top: '50%', 
                            transform: 'translate(-50%, 80%)'
                        }}
                        onClick={onStart}
                    >
                        <h1 className="start-Text">➡ START</h1>
                    </button>
                )}

                {gameState === 'playing' && currentPlatform < totalPlatforms - 1 && (
                    <button 
                        className="button-base next-button"
                        style={{ 
                            position: 'absolute',
                            right: '40px', 
                            bottom: '40px'
                        }}
                        onClick={onNext}
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M9 6l6 6-6 6" 
                                stroke="currentColor" 
                                strokeWidth="4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}

                {gameState === 'playing' && currentPlatform > 0 && (
                    <button 
                        className="button-base prev-button"
                        style={{ 
                            position: 'absolute',
                            left: '40px', 
                            bottom: '40px'
                        }}
                        onClick={onPrev}
                    >
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M15 6l-6 6 6 6" 
                                stroke="currentColor" 
                                strokeWidth="4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}

                {/* 홈으로 가기 버튼 중앙 하단에 위치 */}
                <button
                    className="button-base home-button"
                    style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '40px',  // 하단에 배치
                        transform: 'translateX(-50%)',  // 수평 중앙 정렬
                        fontSize: '15px',
                    }}
                    onClick={() => {
                        if (window.confirm('홈으로 이동하시겠습니까?')) {
                            window.location.href = '/';
                        }
                    }}  // 홈으로 가기
                >
                    HOME
                </button>

                {gameState === 'playing' && currentPlatform === totalPlatforms - 1 && (
                    <button 
                        className="button-base result-button"
                        style={{ 
                            position: 'absolute',
                            left: '50%', 
                            top: '50%', 
                            transform: 'translateX(-50%)'
                        }}
                        onClick={onFinish}
                    >
                        ➡ 결과보기
                    </button>
                )}
            </div>
        </div>
    );
}

export default UIOverlay;
