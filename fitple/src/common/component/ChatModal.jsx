import React from 'react';
import '../css/ChatModal.css';

const ChatModal = ({ isOpen, onClose, chatRooms = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="chat-modal-overlay">
            <div className="chat-modal">
                <button className="close-button" onClick={onClose}>X</button>
                <h2 className='text-align'>Chat Rooms</h2>
                <ul className='list-group chat-room-list'>
                    {chatRooms.map((room, index) => (
                        <li key={room.chatId} className='list-group-item chat-room-item'>Chat Room {room.chatId}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatModal;
