import React, { useState, useEffect } from "react";
import "../static/css/ChatModal.css";
import { leaveChat } from "../../mainpage/apis/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import ChatMessage from "./ChatMessage";

const ChatModal = ({
  isOpen,
  onClose,
  chatRooms = [],
  userId,
  unreadMessage,
  setUnreadMessage,
}) => {
  const [rooms, setRooms] = useState(chatRooms);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    setRooms(chatRooms);
  }, [chatRooms]);

  if (!isOpen) return null;

  const handleLeaveChat = async (chatId) => {
    if (window.confirm("정말로 이 채팅방을 나가시겠습니까?")) {
      try {
        await leaveChat(chatId, userId);
        // 나간 채팅방을 목록에서 제거
        const updatedRooms = rooms.filter((room) => room.chatId !== chatId);
        setRooms(updatedRooms);
      } catch (error) {
        console.error("Failed to leave chat:", error);
      }
    }
  };

  const handleChatClick = (chatId) => {
    setSelectedChatId(chatId);
    // 해당 채팅방의 읽지 않은 메시지를 0으로 초기화
    setUnreadMessage((prev) => ({
      ...prev,
      [chatId]: 0,
    }));
  };

  const handleBack = () => {
    setSelectedChatId(null);
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2 className="text-align chat-name">채팅방</h2>
        {selectedChatId ? (
          <ChatMessage
            chatId={selectedChatId}
            onBack={handleBack}
            rooms={rooms}
            unreadMessage={unreadMessage}
            setUnreadMessage={setUnreadMessage} // ✅ 반드시 전달
          />
        ) : (
          <ul className="list-group chat-room-list">
            {rooms.map((room) => (
              <li
                key={room.chatId}
                className="list-group-item chat-room-item"
                onClick={() => handleChatClick(room.chatId)}
              >
                {room.otherNickname}
                {/* 읽지 않은 메시지가 있으면 빨간 점 표시 */}
                {unreadMessage[room.chatId] > 0 && (
                  <span className="unread-indicator">🔴</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveChat(room.chatId);
                  }}
                  className="leave-button"
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="FontAwesomeIcon"
                  />
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
