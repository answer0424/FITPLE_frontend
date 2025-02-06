import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../../mainpage/apis/api';
import { LoginContext } from '../../mainpage/contexts/LoginContextProvider'

const DailyItem = (event, key) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
  const { authority } = useContext(LoginContext); //권한 정보
  const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

  const openModal = (event) => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const changeStatus = (reservationId, status) => {
    // console.log("보낸다아ㅏ아앙")
    // console.log(reservationId, status);
    api.patch('/member/schedule', 
      {
        reservationId: reservationId,
        status: status
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      console.log("팝업 정해지면 수정")
      console.log(response.status);
    })
  }

  const trainerButtonCompo = () => {
    // 예약 시간 전일때 -> 운동 취소 버튼만
    // 예약 시간 지났을 때 -> 운동 시작/운동 취소
    // 운동 시작 클릭 시 -> 예약 시간으로부터 30분이 지나야 끝 선택 가능/운동 취소
    // 운동 끝 클릭 시 -> 최종 변환. 이후 값 출력
    // 운동 취소 시 -> 버튼 없이 값 출력
    // if문 등으로 출력할 버튼 종류 변환
    // <Button onClick={() => changeStatus(event.event.reservationId, '여기에 바꿀 값을 적으새오')}>버튼만 만들면 알아서 뜰겁니다.</Button>
  };

  useEffect(()=>{
    console.log(api.defaults.baseURL + '/member/schedule');
  })

  return(
    <>
    <div className="event-item">
      <Button onClick={openModal}>
        {`Date: ${new Date(event.event.date).toLocaleString()} | Nickname: ${event.event.nickname} | Reservation ID: ${event.event.reservationId} | User ID: ${event.event.userId}`}
      </Button>
    </div>
    <Modal show={isModalOpen} onHide={closeModal} centered>
        <Modal.Header>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {`Date: ${new Date(event.event.date).toLocaleString()} | Nickname: ${event.event.nickname}| Reservation ID: ${event.event.reservationId} | User ID: ${event.event.userId}`}

            {authority.isTrainer ? (
              <trainerButtonCompo/>
            ) : (
              <>
                {event.event.status === "운동끝" ? (
                  <Button onClick={() => changeStatus(event.event.reservationId, '운동완료')}>운동 끝</Button>
                ) : (
                  <p>status: {event.event.status}</p>
                )}
              </>
            )}
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DailyItem;
