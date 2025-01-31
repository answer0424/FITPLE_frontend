import React from 'react';

function OverlayButton({ text, onClick, position, visible = true }) {
    if (!visible) return null;
    
    const buttonStyle = {
        position: 'absolute',
        padding: '10px 20px',
        backgroundColor: '#4fc3f7',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        ...position
    };

    return (
        <button
            style={buttonStyle}
            onClick={onClick}
            onMouseEnter={e => {
                e.target.style.backgroundColor = '#00ffff';
            }}
            onMouseLeave={e => {
                e.target.style.backgroundColor = '#4fc3f7';
            }}
        >
            {text}
        </button>
    );
}

export default OverlayButton;