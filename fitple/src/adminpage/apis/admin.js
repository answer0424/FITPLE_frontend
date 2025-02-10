import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = import.meta.env.VITE_Server;

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터 추가
api.interceptors.request.use(
    config => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // 인증 에러 시 로그인 페이지로 리다이렉트
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const adminApi = {
    // 회원 관리
    getUsers: async (page = 0, size = 10, sortBy = 'id', direction = 'asc') => {
        const response = await api.get(`/api/admin/users`, {
            params: { page, size, sortBy, direction }
        });
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/api/admin/users/${userId}`);
        return response.data;
    },

    // 트레이너 관리
    getTrainers: async (page = 0, size = 10, sortBy = 'id', direction = 'asc') => {
        const response = await api.get(`/api/admin/trainers`, {
            params: { page, size, sortBy, direction }
        });
        return response.data;
    },

    // 리뷰 관리
    getReviews: async (page = 0, size = 10, sortBy = 'id', direction = 'asc') => {
        const response = await api.get(`/api/admin/reviews`, {
            params: { page, size, sortBy, direction }
        });
        return response.data;
    }
};

export default adminApi;