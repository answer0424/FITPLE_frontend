import React, { useState, useEffect } from 'react';
import '../css/ChatIcon.css';
import chatIcon from '../../assets/chatIcon.png'; // 파일 경로 수정
import ChatModal from './ChatModal';
import { getUserChats } from '../../mainpage/apis/chat';


const ChatIcon = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const userId = 1; // userId 하드코딩

    useEffect(() => {
        if (isModalOpen) {
            fetchChatRooms();
        }
    }, [isModalOpen]);

    const fetchChatRooms = async () => {
        try {
            const data = await getUserChats(userId);
            console.log('Fetched chat rooms:', data); // 데이터 로그 출력
            setChatRooms(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const handleIconClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <div className="chat-icon-container" onClick={handleIconClick}>
                <img src={chatIcon} alt="Chat Icon" className="chat-icon" />
            </div>
            <ChatModal isOpen={isModalOpen} onClose={handleCloseModal} chatRooms={chatRooms} />
        </div>
    );
};

export default ChatIcon;
