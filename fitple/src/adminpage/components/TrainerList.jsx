import React, { useState, useEffect } from 'react';
import { UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import adminApi from '../apis/admin';

const Modal = ({ trainer, onClose }) => {
  if (!trainer) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">트레이너 상세 정보</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        <div className="modal-body">
          <div className="trainer-access">
            <p>: {trainer.isAccess}</p>
          </div>
          <div className="trainer-info">
            <h3>기본 정보</h3>
            <p>이름: {trainer.trainerName}</p>
            <p>이메일: {trainer.trainerEmail}</p>
            <p>회당 가격: {trainer.perPrice}원</p>
            <p>HBTI: {trainer.hbti}</p>
          </div>
          <div className="trainer-gym">
            <h3>헬스장 정보</h3>
            <p>헬스장: {trainer.gymName}</p>
            <p>주소: {trainer.gymAddress}</p>
          </div>
          <div className="trainer-career">
            <h3>경력사항</h3>
            <p>{trainer.career}</p>
          </div>
          <div className="trainer-intro">
            <h3>자기소개</h3>
            <p>{trainer.content}</p>
          </div>
          <div className="trainer-certs">
            <h3>보유 자격증</h3>
            <ul>
              {trainer.certifications?.map((cert, index) => (
                <li key={index}>{cert.skills}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentListModal = ({ trainer, students, onClose }) => {
  if (!trainer) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{trainer.nickname}의 회원 목록</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>
        <div className="modal-body">
          <table className="admin-table">
            <thead className="admin-table-header">
              <tr>
                <th className="admin-table-th">ID</th>
                <th className="admin-table-th">아이디</th>
                <th className="admin-table-th">이메일</th>
                <th className="admin-table-th">이름</th>
                <th className="admin-table-th">남은 횟수</th>
              </tr>
            </thead>
            <tbody className="admin-table-body">
              {students.map((student) => (
                <tr key={student.userId}>
                  <td className="admin-table-td">{student.userId}</td>
                  <td className="admin-table-td">{student.nickname}</td>
                  <td className="admin-table-td">{student.email}</td>
                  <td className="admin-table-td">{student.name}</td>
                  <td className="admin-table-td">{student.times}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusModal = ({ currentStatus, onClose, onStatusUpdate }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <h2 className="modal-header">포트폴리오 승인 상태</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-body">현재 상태:</p>
          <p className="modal-body">
            {currentStatus}
          </p>
        </div>

        <div className="modal-body">
          <button
            onClick={() => onStatusUpdate('승인')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            승인
          </button>
          <button
            onClick={() => onStatusUpdate('거절')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            반려
          </button>
        </div>
      </div>
    </div>
  );
};

const TrainerList = () => {
  const [trainers, setTrainers] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, [page]);

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getTrainers(page);
      setTrainers(data);
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
    }
    setIsLoading(false);
  };

  const handleDeleteTrainer = async (trainerId) => {
    if (window.confirm('트레이너를 삭제하시겠습니까?')) {
      try {
        await adminApi.deleteUser(trainerId, 'ROLE_TRAINER');
        fetchTrainers();
      } catch (error) {
        console.error('Failed to delete trainer:', error);
      }
    }
  };

  const handleViewDetail = async (trainerId) => {
    try {
      const trainerDetail = await adminApi.getTrainerProfile(trainerId);
      setSelectedTrainer(trainerDetail);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch trainer details:', error);
    }
  };

  const handleViewStudents = async (trainer) => {
    try {
      const students = await adminApi.getTrainerStudents(trainer.id);
      setSelectedTrainer(trainer);
      setSelectedStudents(students);
      setShowStudentModal(true);
    } catch (error) {
      console.error('Failed to fetch trainer students:', error);
    }
  };

  const handleStatusClick = async (trainerId) => {
    try {
      const trainerProfile = await adminApi.getTrainerProfile(trainerId);
      setSelectedTrainerId(trainerId);
      setSelectedStatus(trainerProfile.isAccess);
      setShowStatusModal(true);
    } catch (error) {
      console.error('Failed to fetch trainer status:', error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await adminApi.updateTrainerGrantStatus(selectedTrainerId, newStatus);
      await fetchTrainers();
      setShowStatusModal(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title en-font">Trainer List</h5>
        <table className="table table-dark">
          <thead>
            <tr>
              <th className="admin-table-th">#</th>
              <th className="admin-table-th">아이디</th>
              <th className="admin-table-th">이메일</th>
              <th className="admin-table-th">닉네임</th>
              <th className="admin-table-th">회원 목록</th>
              <th className="admin-table-th">트레이너 포토폴리오</th>
              <th className="admin-table-th">승인 상태</th>
              <th className="admin-table-th">관리</th>
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {trainers.content.map((trainer) => (
              <tr key={trainer.id}>
                <td className="admin-table-td">{trainer.id}</td>
                <td className="admin-table-td">{trainer.username}</td>
                <td className="admin-table-td">{trainer.email}</td>
                <td className="admin-table-td">{trainer.nickname}</td>
                <td className="admin-table-td">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewStudents(trainer)}
                  >
                    회원 목록
                  </button>
                </td>
                <td className="admin-table-td">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewDetail(trainer.id)}
                  >
                    상세보기
                  </button>
                </td>
                <td className="admin-table-td">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStatusClick(trainer.id)}
                  >
                    승인상태 확인
                  </button>
                </td>
                <td className="admin-table-td">
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center"
                    onClick={() => handleDeleteTrainer(trainer.id)}
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
      
      {showModal && (
        <Modal
          trainer={selectedTrainer}
          onClose={() => {
            setShowModal(false);
            setSelectedTrainer(null);
          }}
        />
      )}

      {showStudentModal && (
        <StudentListModal
          trainer={selectedTrainer}
          students={selectedStudents}
          onClose={() => {
            setShowStudentModal(false);
            setSelectedTrainer(null);
            setSelectedStudents([]);
          }}
        />
      )}

      {showStatusModal && (
        <StatusModal
          currentStatus={selectedStatus}
          onClose={() => setShowStatusModal(false)}
          onStatusUpdate={handleStatusUpdate}
        />
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
          <span> {page + 1} / {trainers.totalPages}</span>
          <button 
              className="btn btn-secondary col-3" 
              onClick={() => setPage(prev => prev + 1)}
              disabled={page >= trainers.totalPages - 1}
          >
              Next
          </button>
      </div>
    </div>
  );
};

export default TrainerList; 