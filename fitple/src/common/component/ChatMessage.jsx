import { useContext, useEffect, useRef, useState } from 'react';
import { getChatMessages, readMessage } from '../../mainpage/apis/chat';
import '../css/ChatMessage.css';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 추가

const ChatMessage = ({ chatId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { userInfo, stompClient } = useContext(LoginContext); // LoginContext에서 웹소켓 클라이언트 가져오기
  const messageEndRef = useRef(null);

  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
  
    // "연, 월, 일"만 비교하여 날짜 차이를 계산
    const messageYear = messageDate.getFullYear();
    const messageMonth = messageDate.getMonth();
    const messageDay = messageDate.getDate();
  
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDay = now.getDate();
  
    // 같은 날이면 시간만 표시
    if (messageYear === nowYear && messageMonth === nowMonth && messageDay === nowDay) {
      return messageDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }
  
    // 어제 날짜인지 확인
    now.setDate(nowDay - 1); // 현재 날짜에서 하루 빼기
    if (messageYear === now.getFullYear() && messageMonth === now.getMonth() && messageDay === now.getDate()) {
      return '어제';
    }
  
    // 그 외의 경우, YYYY년 MM월 DD일 형식으로 표시
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
        const data = await getChatMessages(chatId);
        setMessages(data);
        
        // 채팅방에 입장했을 때, 상대방 메시지 읽음 처리
        data.forEach(message => {
          if (message.userId !== userInfo.id && !message.checked) {
            readMessage(message.messageId);
          }
        });
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();
  }, [chatId, userInfo.id]);

  // ✅ 웹소켓 메시지 수신 로직 유지 (LoginContext에서 웹소켓을 가져와 사용)
  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const subscription = stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);

      // 수신된 메시지가 내 것이 아니라면 읽음 처리
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

  const handleSendMessage = () => {
    if (newMessage.trim() && stompClient && stompClient.connected) {
      const messageData = {
        content: newMessage,
        chatId: chatId,
        userId: userInfo.id,
        createdAt: new Date().toISOString(),
        checked: false, // 메시지를 보낼 때 checked 상태 설정
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
