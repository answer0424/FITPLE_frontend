import { useContext, useEffect, useRef, useState } from "react";
import { getChatMessages, readMessage } from "../../mainpage/apis/chat";
import "../static/css/ChatMessage.css";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";
import "bootstrap-icons/font/bootstrap-icons.css";

const ChatMessage = ({ chatId, onBack, rooms }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { userInfo, stompClient, setUnreadMessage } = useContext(LoginContext);
  const messageEndRef = useRef(null);
  const [room, setRoom] = useState(null);

  // 메시지 전송 시간에 대한 format
  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();

    const isToday =
      messageDate.getFullYear() === now.getFullYear() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getDate() === now.getDate();

    if (isToday) {
      return messageDate.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    now.setDate(now.getDate() - 1);
    const isYesterday =
      messageDate.getFullYear() === now.getFullYear() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getDate() === now.getDate();

    return isYesterday
      ? "어제"
      : messageDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  // 채팅방 입장 시 하단으로 자동 스크롤
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getChatMessages(chatId, userInfo.id);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchMessages();
  }, [chatId, userInfo.id]);

  //--------------------------------------------------------------------------------------------------------
  // // 메시지 수신 처리
  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const subscription = stompClient.subscribe(
      `/topic/chat/${chatId}`,
      (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);

        // 현재 보고 있는 채팅방이면 바로 읽음 처리
        if (receivedMessage.userId !== userInfo.id) {
          readMessage(receivedMessage.messageId);
        } else {
          handleNewMessage(receivedMessage.chatId, receivedMessage);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, stompClient, userInfo.id]);

  // -----------------------------------------

  // 채팅방 입장, 퇴장 실시간 전송
  useEffect(() => {
    if (stompClient && stompClient.connect && chatId) {
      stompClient.publish({
        destination: "/app/chat/enter",
        body: JSON.stringify({ roomId: chatId, userId: userInfo.id }),
      });
    }
    return () => {
      if (stompClient && stompClient.connected && chatId) {
        stompClient.publish({
          destination: "/app/chat/exit",
          body: JSON.stringify({ roomId: chatId, userId: userInfo.id }),
        });
      }
    };
  }, [chatId, stompClient, userInfo.id]);

  const readMessage = (messageId) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/chat/read",
        body: JSON.stringify({
          roomId: chatId,
          userId: userInfo.id,
          messageId,
        }),
      });

      setUnreadMessage((prev) => {
        return {
          ...prev,
          [chatId]: 0,
        };
      });
    }
  };

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const subscription = stompClient.subscribe(
      `/topic/chat/read/${chatId}`,
      (message) => {
        const readReceipt = JSON.parse(message.body);

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            readReceipt.readMessageIds.includes(msg.messageId)
              ? { ...msg, checked: true }
              : msg
          )
        );
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, stompClient]);

  const handleNewMessage = (roomId, message) => {
    // 현재 보고 있는 채팅방이라면 unreadMessage를 업데이트하지 않음

    if (roomId === chatId) return;

    setUnreadMessage((prev) => {
      const updatedUnreadMessage = {
        ...prev,
        [roomId]: (prev[roomId] ?? 0) + 1,
      };

      localStorage.setItem(
        "unreadMessage",
        JSON.stringify(updatedUnreadMessage)
      );
      return updatedUnreadMessage;
    });
  };

  //--------------------------------------------------------------------------------------------------------
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const currentRoom = rooms.find((room) => room.chatId === chatId);
    setRoom(currentRoom);
  }, [chatId, rooms]);

  const handleSendMessage = () => {
    if (newMessage.trim() && stompClient && stompClient.connected) {
      const messageData = {
        content: newMessage,
        chatId: chatId,
        userId: userInfo.id,
        createdAt: new Date().toISOString(),
        checked: false,
      };

      stompClient.publish({
        destination: `/app/chat/${chatId}/send`,
        body: JSON.stringify(messageData),
      });

      setNewMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-message-container">
      <button onClick={onBack}>
        <i className="bi bi-arrow-left"></i> {room && room.otherNickname}
      </button>

      <ul className="message-list">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`message-item ${
              message.userId === userInfo.id ? "self-message" : "other-message"
            }`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-info">
              {message.userId === userInfo.id && message.checked && (
                <span className="read-status">
                  <i className="bi check-all text-primary">✔</i>
                </span>
              )}
              <span
                className={`${
                  message.userId === userInfo.id
                    ? "my-message-time"
                    : "your-message-time"
                }`}
              >
                {formatMessageTime(message.createdAt)}
              </span>
            </div>
          </li>
        ))}
        <div ref={messageEndRef} />
      </ul>

      <div className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="message-input"
        />
        <button onClick={handleSendMessage} className="message-send-button">
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
