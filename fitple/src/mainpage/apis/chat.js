import axios from 'axios';

const CHAT_BASE_URL = 'http://localhost:8081/api';

// 채팅방 생성 url
export const createChat = async (userId, trainerId) => {
    const response = await axios.post(`${CHAT_BASE_URL}/chat/create`, { userId, trainerId });
    return response.data;
};

// 채팅방 나가기 url
export const leaveChat = async (chatId, userId) => {
    const response = await axios.delete(`${CHAT_BASE_URL}/chat/${chatId}/leave/${userId}`);
    return response.data;
};

// 채팅방 목록 가져오는 url
export const getUserChats = async (userId) => {
    const response = await axios.get(`${CHAT_BASE_URL}/chat/rooms/${userId}`);
    return response.data;
};

// 특정 채팅방 메시지 목록 가져오는 url
export const getChatMessages = async (chatId) => {
    const response = await axios.get(`${CHAT_BASE_URL}/chat/${chatId}/messages`);
    return response.data;
};

// 메시지 읽음 여부
export const readMessage = async (chatId) => {
    const response = await axios.post(`${CHAT_BASE_URL}/chat/${chatId}/read`);
    return response.data;
};