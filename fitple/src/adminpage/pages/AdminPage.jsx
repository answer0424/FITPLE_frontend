import React, { useState } from 'react';
import UserList from '../components/UserList';
import TrainerList from '../components/TrainerList';
import ReviewList from '../components/ReviewList';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <nav className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 mr-2 font-medium ${
            activeTab === 'users'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          회원 목록
        </button>
        <button
          className={`py-2 px-4 mr-2 font-medium ${
            activeTab === 'trainers'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('trainers')}
        >
          트레이너 목록
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'reviews'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          리뷰 목록
        </button>
      </nav>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'users' && <UserList />}
        {activeTab === 'trainers' && <TrainerList />}
        {activeTab === 'reviews' && <ReviewList />}
      </div>
    </div>
  );
};

export default AdminPage;
