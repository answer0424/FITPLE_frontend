import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { getChatMessages } from '../../mainpage/apis/chat';
import '../css/ChatMessage.css'; // CSS 파일 import

const ChatMessage = ({ chatId, onBack, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getChatMessages(chatId);
                setMessages(data);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };

        fetchMessages();

        const client = new Client({
            brokerURL: 'ws://localhost:8081/ws-chat',  // STOMP 서버 주소
            connectHeaders: {},
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log('WebSocket Connected');

                // 채팅방 메시지 구독
                client.subscribe(`/topic/chat/${chatId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            },
            onDisconnect: () => console.log('WebSocket Disconnected'),
        });

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [chatId]);

    const handleSendMessage = () => {
        if (newMessage.trim() && stompClient) {
            const messageData = {
                content: newMessage,
                chatId: chatId,
                userId: 1, // 현재 로그인한 유저의 ID
            };

            stompClient.publish({
                destination: `/app/chat/${chatId}/send`, // 서버 메시지 처리 엔드포인트
                body: JSON.stringify(messageData),
            });

            setNewMessage('');
        }
    };

    // 엔터 키 입력 시 메시지 전송
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-message-container">
            <button onClick={onBack}>Back to Chat Rooms</button>
            <ul className="message-list">
                {messages.map((message, index) => (
                    <li
                        key={index}
                        className={`message-item ${
                            message.userId === 1 ? 'self-message' : 'other-message'
                        }`}
                    >
                        {message.content}
                    </li>
                ))}
            </ul>
            <div className="message-input-container">
                <input
                    type="text"
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress} // 엔터 키 이벤트 추가
                    placeholder="Type your message..."
                />
                <button className="message-send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatMessage;
