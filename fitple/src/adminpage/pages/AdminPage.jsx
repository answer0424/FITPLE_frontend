import React, { useState } from 'react';
import UserList from '../components/UserList';
import TrainerList from '../components/TrainerList';
import ReviewList from '../components/ReviewList';
import './admin.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      
      <nav className="admin-nav">
        <button
          className={`admin-nav-button ${
            activeTab === 'users' ? 'admin-nav-button-active' : 'admin-nav-button-inactive'
          }`}
          onClick={() => setActiveTab('users')}
        >
          회원 목록
        </button>
        <button
          className={`admin-nav-button ${
            activeTab === 'trainers' ? 'admin-nav-button-active' : 'admin-nav-button-inactive'
          }`}
          onClick={() => setActiveTab('trainers')}
        >
          트레이너 목록
        </button>
        <button
          className={`admin-nav-button ${
            activeTab === 'reviews' ? 'admin-nav-button-active' : 'admin-nav-button-inactive'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          리뷰 목록
        </button>
      </nav>

      <div className="mt-4">
        {activeTab === 'users' && <UserList />}
        {activeTab === 'trainers' && <TrainerList />}
        {activeTab === 'reviews' && <ReviewList />}
      </div>
    </div>
  );
};

export default AdminPage;