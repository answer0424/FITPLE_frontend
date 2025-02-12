import React, { useState, useEffect } from 'react';
import { UserX, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import adminApi from '../apis/admin';

const Modal = ({ trainer, onClose }) => {
  if (!trainer) return null;

  return ( 
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">트레이너 상세 정보</h5>
            <button type="button" className="btn-close col-6" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body font-black">
            <div className="trainer-access mb-4">
              <span className={`badge ${trainer.isAccess === '승인' ? 'bg-success' : 'bg-warning text-dark'}`}>
                승인 상태: {trainer.isAccess}
              </span>
            </div>
            <div className="trainer-info border-bottom pb-3 mb-3">
              <h5 className="fw-semibold">📌 기본 정보</h5>
              <p><strong>이름:</strong> {trainer.trainerName}</p>
              <p><strong>이메일:</strong> {trainer.trainerEmail}</p>
              <p><strong>회당 가격:</strong> {trainer.perPrice}원</p>
              <p><strong>HBTI:</strong> {trainer.hbti}</p>
            </div>
            <div className="trainer-gym border-bottom pb-3 mb-3">
              <h5 className="fw-semibold">🏋️ 헬스장 정보</h5>
              <p><strong>헬스장:</strong> {trainer.gymName}</p>
              <p><strong>주소:</strong> {trainer.gymAddress}</p>
            </div>
            <div className="trainer-career border-bottom pb-3 mb-3">
              <h5 className="fw-semibold">📅 경력사항</h5>
              <p>{trainer.career}</p>
            </div>
            <div className="trainer-intro border-bottom pb-3 mb-3">
              <h5 className="fw-semibold">📝 자기소개</h5>
              <p className='font-black'>{trainer.content}</p>
            </div>
            <div className="trainer-certs">
              <h5 className="fw-semibold">📜 보유 자격증</h5>
              <div className="d-flex flex-wrap gap-2">
                {trainer.certifications?.map((cert, index) => (
                  <span key={index} className="badge bg-primary">{cert.skills}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary w-100" data-bs-dismiss="modal" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const StudentListModal = ({ trainer, students, onClose }) => {
  if (!trainer) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{trainer.nickname}의 회원 목록</h5>
            <button type="button" className="btn-close col-6" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>아이디</th>
                  <th>이메일</th>
                  <th>이름</th>
                  <th>남은 횟수</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.userId}>
                      <td>{student.userId}</td>
                      <td>{student.nickname}</td>
                      <td>{student.email}</td>
                      <td>{student.name}</td>
                      <td>{student.times}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">회원 없음</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusModal = ({ currentStatus, onClose, onStatusUpdate }) => {
  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">포트폴리오 승인 상태</h5>
            <button type="button" className="btn-close col-6" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body font-black">
            <span className={`badge ${currentStatus === '승인' ? 'bg-success' : 'bg-warning text-dark'}`}>
              현재 상태: {currentStatus}
            </span>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={() => onStatusUpdate('승인')}>승인</button>
            <button className="btn btn-danger" onClick={() => onStatusUpdate('거절')}>반려</button>
          </div>
        </div>
      </div>
    </div>
  );
};


const TrainerList = ({setChatTrainers}) => {
  const [trainers, setTrainers] = useState([]);  // 트레이너 목록
  const [totalPages, setTotalPages] = useState(0);  // 전체 페이지 수
  const [page, setPage] = useState(0);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); // 기본 정렬: id 기준 asc

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      let allTrainers = [];
      let currentPage = 0;
      let total = 0;
      do {
        const data = await adminApi.getTrainers(currentPage);
        allTrainers = [...allTrainers, ...data.content];
        total = data.totalPages;
        currentPage++;
      } while (currentPage < total);

      setTrainers(allTrainers);  // 트레이너 목록 설정
      setTotalPages(total);  // 전체 페이지 수 설정
      setChatTrainers(allTrainers);
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
    // 상태 업데이트 전에 confirm 창 띄우기
    const isConfirmed = window.confirm('승인 상태를 업데이트하시겠습니까?');
    
    if (isConfirmed) {
      try {
        // 승인 상태 업데이트
        await adminApi.updateTrainerGrantStatus(selectedTrainerId, newStatus);
        
        // 트레이너 목록 새로고침
        await fetchTrainers();
        
        // 상태 업데이트 후 모달 닫기
        setShowStatusModal(false);
        
      } catch (error) {
        console.error('Failed to update status:', error);
        alert('승인 상태 업데이트에 실패했습니다.');
      }
    } else {
      // 사용자가 취소를 클릭한 경우
      console.log('승인 상태 업데이트가 취소되었습니다.');
    }
  };
  

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTrainers = [...trainers].sort((a, b) => {
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (typeof valueA === 'string') {
      return sortConfig.direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
  });

  const getSortIcon = (key) => {
    return sortConfig.key === key ? (sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />) : <ChevronDown size={16} className="opacity-50" />;
  };

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="card card-bg-color">
      <div className="card-body">
        <h5 className="card-title en-font">Trainer List</h5>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col" onClick={() => handleSort('id')} className="sortable">
                # {getSortIcon('id')}
              </th>
              <th scope="col" onClick={() => handleSort('username')} className="sortable">
                아이디 {getSortIcon('username')}
              </th>
              <th scope="col" onClick={() => handleSort('email')} className="sortable">
                이메일 {getSortIcon('email')}
              </th>
              <th scope="col" onClick={() => handleSort('nickname')} className="sortable">
                닉네임 {getSortIcon('nickname')}
              </th>
              <th className="admin-table-th">회원 목록</th>
              <th className="admin-table-th">트레이너 포토폴리오</th>
              <th className="admin-table-th">승인 상태</th>
              <th className="admin-table-th">관리</th>
            </tr>
          </thead>
          <tbody className="admin-table-body">
            {sortedTrainers.slice(page * 10, (page + 1) * 10).map((trainer, index) => (
              <tr key={trainer.id}>
                <td className="admin-table-td">{trainer.id}</td>
                <td className="admin-table-td">{trainer.username}</td>
                <td className="admin-table-td">{trainer.email}</td>
                <td className="admin-table-td">{trainer.nickname}</td>
                <td className="admin-table-td">
                  <button
                    className="btn btn-primary btn-sm btn-detail kr-font"
                    onClick={() => handleViewStudents(trainer)}
                  >
                    회원 목록
                  </button>
                </td>
                <td className="admin-table-td">
                  <button
                    className="btn btn-primary btn-sm btn-detail kr-font"
                    onClick={() => handleViewDetail(trainer.id)}
                  >
                    상세보기
                  </button>
                </td>
                <td className="admin-table-td">
                  <button
                    className="btn btn-primary btn-sm btn-detail kr-font"
                    onClick={() => handleStatusClick(trainer.id)}
                  >
                    승인상태 확인
                  </button>
                </td>
                <td className="admin-table-td">
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center kr-font"
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
        <span> {page + 1} / {totalPages}</span>
        <button 
          className="btn btn-secondary col-3" 
          onClick={() => setPage(prev => prev + 1)}
          disabled={page >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TrainerList;
