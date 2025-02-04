import React from 'react';
import '../css/ChatIcon.css';
import chatIcon from '../../assets/chatIcon.png'; // 파일 경로 수정

const ChatIcon = () => {
    return (
        <div className="chat-icon-container">
            <img src={chatIcon} alt="Chat Icon" className="chat-icon" />
        </div>
    );
};

export default ChatIcon;
