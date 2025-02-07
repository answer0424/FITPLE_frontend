import { useContext, useEffect, useRef, useState } from 'react';
import { getChatMessages, readMessage } from '../../mainpage/apis/chat';
import '../css/ChatMessage.css';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 추가

const ChatMessage = ({ chatId, onBack, rooms }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { userInfo, stompClient } = useContext(LoginContext); // LoginContext에서 웹소켓 클라이언트 가져오기
  const messageEndRef = useRef(null);
  const [room, setRoom] = useState(null);

  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
  
    const messageYear = messageDate.getFullYear();
    const messageMonth = messageDate.getMonth();
    const messageDay = messageDate.getDate();
  
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDay = now.getDate();
  
    if (messageYear === nowYear && messageMonth === nowMonth && messageDay === nowDay) {
      return messageDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
  
    now.setDate(nowDay - 1);
    if (messageYear === now.getFullYear() && messageMonth === now.getMonth() && messageDay === now.getDate()) {
      return '어제';
    }
  
    return messageDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getChatMessages(chatId, userInfo.id); // ✅ userId 전달
        setMessages(data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();
}, [chatId, userInfo.id]);


  // 메시지 목록이 변경될 때마다 읽음 상태를 업데이트
  useEffect(() => {
    messages.forEach(message => {
      if (message.userId !== userInfo.id && !message.checked) {
        readMessage(message.messageId);
      }
    });
  }, [messages, userInfo.id]);
  

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const subscription = stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);

      if (receivedMessage.userId !== userInfo.id) {
        readMessage(receivedMessage.messageId);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, stompClient, userInfo.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 특정 chatId에 대한 room 정보 가져오기
  useEffect(() => {
    const currentRoom = rooms.find(room => room.chatId === chatId);
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
        <i className="bi bi-arrow-left"></i> {room && room.otherNickname}
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
              {message.userId === userInfo.id && message.checked && (
                <span className='read-status'><i className="bi check-all text-primary">✔</i></span>// ✔ (읽음)
              )}
              <span className={` ${
              message.userId === userInfo.id ? 'my-message-time' : 'your-message-time'
            }`}>
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
          <i className="bi bi-send"></i> {/* Bootstrap Send 아이콘 */}
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
