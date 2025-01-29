import axios from 'axios';

const baseURL = import.meta.env.VITE_Server

const api = axios.create({
    baseURL: baseURL,
});

export default api;