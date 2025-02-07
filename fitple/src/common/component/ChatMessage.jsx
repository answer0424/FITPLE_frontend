import { useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { getChatMessages } from '../../mainpage/apis/chat';
import '../css/ChatMessage.css';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 추가

const ChatMessage = ({ chatId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { userInfo } = useContext(LoginContext);
  const stompClient = useRef(null);
  const messageEndRef = useRef(null);

  

  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return messageDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffDays === 1) {
      return '어제';
    } else {
      return messageDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getChatMessages(chatId);
        setMessages(data);
        console.log(data)
        data.forEach(message => {
          if (!message.readBy?.includes(userInfo.id)) {
            // updateMessageReadStatus(message.id);
          }
        });
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();
    const client = new Client({
      brokerURL: 'ws://localhost:8081/ws-chat',
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket Connected');
        client.subscribe(`/topic/chat/${chatId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          if (receivedMessage.userId !== userInfo.id) {
            // updateMessageReadStatus(receivedMessage.id);
          }
        });
      },
      onDisconnect: (error) => console.log('WebSocket Disconnected', error),
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [chatId, userInfo.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && stompClient.current) {
      const messageData = {
        content: newMessage,
        chatId: chatId,
        userId: userInfo.id,
        createdAt: new Date().toISOString(),
        readBy: [userInfo.id],
      };

      stompClient.current.publish({
        destination: `/app/chat/${chatId}/send`,
        body: JSON.stringify(messageData),
      });

      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-message-container">
      <button onClick={onBack}>
        Back to Chat Rooms
      </button>

      <ul className="message-list">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`message-item ${
              message.userId === userInfo.id ? 'self-message' : 'other-message'
            }`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-info">
              {/* {message.userId === userInfo.id && (
                <span className="read-status">
                {message.readBy?.length > 1 ? (
                  // <i className="bi check-all text-primary"></i> // ✔✔ (읽음)
                  <div>읽음</div>
                ) : (
                  <div></div>
                )}
              </span>
              )} */}
              {message.checked === true && (
                <span className='read-status'><i className="bi check-all text-primary">✔</i></span>// ✔ (읽음)
              )}
              <span className="message-time">
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
        <button 
          onClick={handleSendMessage} 
          className="message-send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;