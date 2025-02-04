import React, { useState, useEffect } from 'react';
import '../css/ChatModal.css';
import { leaveChat } from '../../mainpage/apis/chat'; // chat.js에서 함수 가져옴
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ChatMessage from './ChatMessage'; // ChatMessage 컴포넌트 추가

const ChatModal = ({ isOpen, onClose, chatRooms, userId }) => {
    const [rooms, setRooms] = useState(chatRooms);
    const [selectedChatId, setSelectedChatId] = useState(null);

    useEffect(() => {
        setRooms(chatRooms);
    }, [chatRooms]);

    if (!isOpen) return null;

    const handleLeaveChat = async (chatId) => {
        if (window.confirm('정말로 이 채팅방을 나가시겠습니까?')) {
            try {
                await leaveChat(chatId, userId);
                // 나간 채팅방을 목록에서 제거
                const updatedRooms = rooms.filter(room => room.chatId !== chatId);
                setRooms(updatedRooms);
            } catch (error) {
                console.error('Failed to leave chat:', error);
            }
        }
    };

    const handleChatClick = (chatId) => {
        setSelectedChatId(chatId);
    };

    const handleBack = () => {
        setSelectedChatId(null);
    };

    return (
        <div className="chat-modal-overlay">
            <div className="chat-modal">
                <button className="close-button" onClick={onClose}>X</button>
                <h2 className='text-align chat-name'>채팅방</h2>
                {selectedChatId ? (
                    <ChatMessage chatId={selectedChatId} onBack={handleBack} />
                ) : (
                    <ul className='list-group chat-room-list'>
                        {rooms.map((room) => (
                            <li key={room.chatId} className='list-group-item chat-room-item' onClick={() => handleChatClick(room.chatId)}>
                                Chat Room {room.chatId}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLeaveChat(room.chatId);
                                    }}
                                    className="leave-button"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ChatModal;
