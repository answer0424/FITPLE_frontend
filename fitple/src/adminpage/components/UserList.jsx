import React, { useState, useEffect } from 'react';
import { UserX } from 'lucide-react';
import adminApi from '../apis/admin';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserList.css';


const UserTable = () => {
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
        if (!window.confirm('정말로 삭제하시겠습니까?')) return;

        try {
            await adminApi.deleteUser(userId);
            fetchUsers(); // 삭제 후 목록 갱신
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title en-font">User List</h5>

                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">아이디</th>
                                <th scope="col">이메일</th>
                                <th scope="col">생일</th>
                                <th scope="col">닉네임</th>
                                <th scope="col">트레이너 목록</th>
                                <th scope="col">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.content.length > 0 ? (
                                users.content.map((user, index) => (
                                    <tr key={user.id}>
                                        <th scope="row">{index + 1 + page * 10}</th>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.birth}</td>
                                        <td>{user.nickname}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleViewTrainers(user.id)}
                                            >
                                                상세보기
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm d-flex align-items-center"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <UserX className="h-4 w-4 me-1" />
                                                삭제하기
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                <div className="d-flex justify-content-between">
                    <button 
                        className="btn btn-secondary col-3" 
                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                        disabled={page === 0}
                    >
                        Previous
                    </button>
                    <span> {page + 1} / {users.totalPages}</span>
                    <button 
                        className="btn btn-secondary col-3" 
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={page >= users.totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* 트레이너 목록 모달 */}
            <div className={`modal fade ${isModalOpen ? 'show' : ''}`} id="trainerModal" tabIndex="-1" style={{ display: isModalOpen ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header col-12">
                        <h5 className="modal-title">트레이너 목록</h5>
                        <button type="button" className="btn-close col-2" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsModalOpen(false)}></button>
                    </div>
                    <div className="modal-body bg-color">
                        <table className="table">
                        <thead>
                            <tr>
                            <th>트레이너 ID</th>
                            <th>아이디</th>
                            <th>이메일</th>
                            <th>남은 횟수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedTrainers.length > 0 ? (
                            selectedTrainers.map((trainer) => (
                                <tr key={trainer.trainerId}>
                                <td>{trainer.trainerId}</td>
                                <td>{trainer.name}</td>
                                <td>{trainer.email}</td>
                                <td>{trainer.remainingSessions}회</td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="4" className="text-center">트레이너 없음</td>
                            </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                    <div className="modal-footer col-12">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setIsModalOpen(false)}>
                        닫기
                        </button>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    );
};

export default UserTable;
