import React, { useState, useEffect, useContext } from 'react';
import '../css/ChatIcon.css';
import chatIcon from '../../assets/chatIcon.png';
import ChatModal from './ChatModal';
import { getUserChats } from '../../mainpage/apis/chat';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';

const ChatIcon = () => {
    const { userInfo, stompClient } = useContext(LoginContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const { unreadMessage, setUnreadMessage } = useContext(LoginContext);

    const userId = userInfo ? userInfo.id : null;

    useEffect(() => {
        if (isModalOpen) {
            fetchChatRooms();
        }
    }, [isModalOpen]);

    useEffect(() => {
        // 🔹 unreadMessage 초기화가 필요한 경우
        if (unreadMessage && Object.values(unreadMessage).includes(undefined)) {
            setUnreadMessage(prev => {
                const cleanedUnreadMessage = Object.fromEntries(
                    Object.entries(prev).filter(([key, value]) => value !== undefined)
                );
                return cleanedUnreadMessage;
            });
        }
    }, [unreadMessage, setUnreadMessage]);

    const fetchChatRooms = async () => {
        try {
            console.log('현재 로그인한 유저', userId);
            const data = await getUserChats(userId);
            console.log('Fetched chat rooms:', data);
            setChatRooms(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const handleIconClick = () => {
        setModalOpen(true);
        setUnreadMessage((prev) => ({
            ...prev,
            undefined: 0
        }));
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // 🔹 모든 채팅방의 읽지 않은 메시지가 0인지 확인
    const hasUnreadMessage = Object.values(unreadMessage || {}).some(count => count > 0);

    console.log('hasUnreadMessage래' ,hasUnreadMessage, unreadMessage);

    return (
        <div className="relative">
            <div className="chat-icon-container" onClick={handleIconClick}>
                <img src={chatIcon} alt="Chat Icon" className="chat-icon" />
            </div>
            {/* 🔴 빨간 점 표시 */}
            {hasUnreadMessage && (
                <span style={{
                    position: "fixed",
                    bottom: 65,
                    right: 25,
                    width: 12,
                    height: 12,
                    backgroundColor: "red",
                    borderRadius: "50%",
                    zIndex: 9999,
                }}></span>
            )}
            <ChatModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                chatRooms={chatRooms} 
                userId={userId} 
                stompClient={stompClient} 
                unreadMessage={unreadMessage} 
                setUnreadMessage={setUnreadMessage}
            />
        </div>
    );
};

export default ChatIcon;
