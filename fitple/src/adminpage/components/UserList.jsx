import React, { useState, useEffect } from 'react';
import { UserX, ChevronLeft, ChevronRight, X } from 'lucide-react';
import adminApi from '../apis/admin';
import '../pages/admin.css';

const UserList = () => {
    const [users, setUsers] = useState({ content: [], totalPages: 0 });
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTrainers, setSelectedTrainers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleViewTrainers = async (studentId) => {
        try {
            const trainers = await adminApi.getStudentTrainers(studentId);
            setSelectedTrainers(trainers);
            setIsModalOpen(true);
        } catch (error) {
            console.error('트레이너 정보 로딩 실패:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
            try {
                // 기본값으로 ROLE_STUDENT 설정
                await adminApi.deleteUser(userId, 'ROLE_STUDENT');
                alert('사용자가 삭제되었습니다.');
                fetchUsers(); // 삭제 후 목록 새로고침
            } catch (error) {
                console.error('Failed to delete user:', error);
                alert('사용자 삭제에 실패했습니다.');
            }
        }
    };

    const TrainerModal = ({ isOpen, onClose, trainers }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">트레이너 목록</h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">트레이너 ID</th>
                                    <th className="px-4 py-2 text-left">아이디</th>
                                    <th className="px-4 py-2 text-left">이메일</th>
                                    <th className="px-4 py-2 text-left">남은 횟수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainers.map((trainer) => (
                                    <tr key={trainer.trainerId} className="border-b">
                                        <td className="px-4 py-2">{trainer.trainerId}</td>
                                        <td className="px-4 py-2">{trainer.name}</td>
                                        <td className="px-4 py-2">{trainer.email}</td>
                                        <td className="px-4 py-2">{trainer.remainingSessions}회</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

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
                            <th className="admin-table-th">생일</th>
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
                                <td className="admin-table-td">{user.birth}</td>
                                <td className="admin-table-td">{user.nickname}</td>
                                <td className="admin-table-td">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        onClick={() => handleViewTrainers(user.id)}
                                    >
                                        상세보기
                                    </button>
                                </td>
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
            <TrainerModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                trainers={selectedTrainers}
            />
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