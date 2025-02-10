import React, { useState, useEffect } from 'react';
import { UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import adminApi from '../apis/admin';
import '../pages/admin.css';

const UserList = () => {
  const [users, setUsers] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getUsers(page);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <div>
        <h2 className="panel-title">User Management</h2>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead className="admin-table-header">
            <tr>
              <th className="admin-table-th">ID</th>
              <th className="admin-table-th">아이디</th>
              <th className="admin-table-th">이메일</th>
              <th className="admin-table-th">닉네임</th>
              <th className="admin-table-th">트레이너 목록</th>
              <th className="admin-table-th">관리</th>
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {users.content.map((user) => (
              <tr key={user.id}>
                <td className="admin-table-td">{user.id}</td>
                <td className="admin-table-td">{user.username}</td>
                <td className="admin-table-td">{user.email}</td>
                <td className="admin-table-td">{user.nickname}</td>
                <td className="admin-table-td">{user.nickname}</td>
                <td className="admin-table-td">
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    삭제하기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="pagination-text">
          Page {page + 1} of {users.totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => setPage(p => p + 1)}
          disabled={page >= users.totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default UserList;