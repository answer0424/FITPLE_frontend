import { useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { getChatMessages } from '../../mainpage/apis/chat';
import '../css/ChatMessage.css';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';

const ChatMessage = ({ chatId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { userInfo } = useContext(LoginContext);
    const stompClient = useRef(null); // useState 대신 useRef 사용

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
            brokerURL: 'ws://localhost:8081/ws-chat', // WebSocket 서버 주소
            connectHeaders: {},
            debug: (str) => console.log(str),
            reconnectDelay: 5000, // 자동 재연결 (5초)
            onConnect: () => {
                console.log('WebSocket Connected');

                client.subscribe(`/topic/chat/${chatId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            },
            onDisconnect: (error) => console.log('WebSocket Disconnected', error),
        });

        client.activate();
        stompClient.current = client; // useRef에 저장

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [chatId]);

    const handleSendMessage = () => {
        if (newMessage.trim() && stompClient.current) {
            const messageData = {
                content: newMessage,
                chatId: chatId,
                userId: userInfo.id,
            };

            stompClient.current.publish({
                destination: `/app/chat/${chatId}/send`, // 메시지 전송 경로
                body: JSON.stringify(messageData),
            });

            setNewMessage('');
        }
    };

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
                            message.userId === userInfo.id ? 'self-message' : 'other-message'
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
                    onKeyPress={handleKeyPress}
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
