import api from './api';

export const login = (username, password) => api.post('login', {username, password}, {headers: {"Content-Type" : "application/x-www-form-urlencoded"}})

// 모든 user 정보 요청
export const userInfo = () => api.get('register/users');

// auth 정보 요청 
export const authInfo = () => api.get('register/auth');

// 회원가입 요청(학생 유저)
export const registerStudent = (userData) => api.post('register/student', userData);

// 회원가입 요청(트레이너 유저)
export const registerTrainer = (userData) => api.post('register/trainer', userData);

