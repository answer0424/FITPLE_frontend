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
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const adminApi = {
    // 회원 관리
    getUsers: async (page = 0, size = 10, sortBy = 'id', direction = 'asc') => {
        const response = await api.get(`/api/admin/users`, {
            params: { page, size, sortBy, direction }
        });
    
        return response.data;
    },

    getStudentTrainers: async (studentId) => {
        const response = await api.get(`/api/admin/students/${studentId}/trainers`);
        return response.data;
    },

    deleteUser: async (userId, role) => {
        const response = await api.delete(`/api/admin/users/${userId}`, {
            params: { role }
        });

        return response.data;
    },

    // 트레이너 관리
    getTrainers: async (page = 0, size = 10, sortBy = 'id', direction = 'asc') => {
        const response = await api.get(`/api/admin/trainers`, {
            params: { page, size, sortBy, direction }
        });
  
        return response.data;
    },

    getTrainerProfile: async (trainerId) => {
        const response = await api.get(`/api/admin/trainers/${trainerId}/profile`);

        return response.data;
    },

    getTrainerStudents: async (trainerId) => {
        const response = await api.get(`/api/admin/trainers/${trainerId}/students`);

        return response.data;
    },
    getTrainerGrantStatus: async (trainerId) => {
        const response = await api.get(`/api/admin/trainers/${trainerId}/grant-status`);

        return response.data;
    },

    updateTrainerGrantStatus: async (trainerId, status) => {
        const response = await api.put(`/api/admin/trainers/${trainerId}/grant-status`, null, {
            params: { status }
        });

        return response.data;
    },

    // 리뷰 관리
    getReviews: async (page = 0, size = 10, sortBy = 'id', direction = 'asc') => {
        const response = await api.get(`/api/admin/reviews`, {
            params: { page, size, sortBy, direction }
        });
 
        return response.data;
    },

    getReviewDetail: async (reviewId) => {
        const response = await api.get(`/api/admin/reviews/${reviewId}`);

        return response.data;
    },

    deleteReview: async (reviewId) => {
        const response = await api.delete(`/api/admin/reviews/${reviewId}`);

        return response.data;
    }
};

export default adminApi;