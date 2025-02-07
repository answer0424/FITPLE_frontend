import React, { useState, useEffect, useContext } from 'react';
import '../css/ChatIcon.css';
import chatIcon from '../../assets/chatIcon.png'; // 파일 경로 수정
import ChatModal from './ChatModal';
import { getUserChats } from '../../mainpage/apis/chat';
import { userInfo } from '../../mainpage/apis/auth';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider';


const ChatIcon = () => {
    const {userInfo} = useContext(LoginContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const userId = userInfo ? userInfo.id : null; // userInfo에서 로그인한 유저 id 가져오기

    useEffect(() => {
        if (isModalOpen) {
            fetchChatRooms();
        }
    }, [isModalOpen]);

    const fetchChatRooms = async () => {
        try {
            console.log('현재 로그인한 유저', userId);
            const data = await getUserChats(userId);
            console.log('Fetched chat rooms:', data); // 데이터 로그 출력
            setChatRooms(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const handleIconClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <div className="chat-icon-container" onClick={handleIconClick}>
                <img src={chatIcon} alt="Chat Icon" className="chat-icon" />
            </div>
            <ChatModal isOpen={isModalOpen} onClose={handleCloseModal} chatRooms={chatRooms} userId={userId}/>
        </div>
    );
};

export default ChatIcon;
