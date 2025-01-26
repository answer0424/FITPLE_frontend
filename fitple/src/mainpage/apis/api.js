import axios from 'axios';

const baseUrl = import.meta.env.VITE_Server

const api = axios.create({
    baseURL: baseUrl,
});

export default api;