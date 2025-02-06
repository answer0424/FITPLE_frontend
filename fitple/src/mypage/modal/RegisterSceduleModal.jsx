import React from 'react';
import { Modal, Button, Form } from "react-bootstrap";

const RegisterSceduleModal = ({ isModalOpen, closeModal, selectedDate, timeInput, setTimeInput }) => {

    // const [eventInput, setEventInput] = useState(""); // 일정 제목 입력 상태
    // const [timeInput, setTimeInput] = useState(""); // 일정 시간 입력 상태

    // TODO
    // updateEvent 선언
    // 여기서 값을 입력 받고, api.post()로 백에 예약사항 저장
    // 그것과 별개로 updateEvent를 이용해 페이지에 표시되는 값도 수정되게 해야함
    // ㄴ> 통신도 비동기, useState도 비동기, 백에 갔어도 DB에 실질 업데이트는 언제 될지 모릅니다. 굳이 에러가 안나도 화면에 표시되지 않을 수도 있어요
    // 기존에 입력된 값 삭제도 새로 만드셔야할 것 같고
    // 어느 유저에 대한 예약인지 확인을 위해 이 모달이 로딩되자마자 트레이너의 유저 목록이 출력되어야 합니다
    // ㄴ> 매 로딩마다 back과 통신하는 것도 방법이지만, 유저가 추가되지 않으면 변할 일 없는게 유저 목록이니
    //     트레이너 페이지에서 유저 목록을 받아오고, 거기서부터 context를 쓰시는 것도 방법일 수 있어요
    //     다만 트레이너 페이지의 다른 부분에서 유저 추가 기능을 구현하시면, 그와 동시에 context 업데이트도 진행하셔야 될겁니다

    return (
      <>
        <Modal.Body>
          {/* <p>선택된 날짜: {selectedDate}</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>일정 제목</Form.Label>
              <Form.Control
                type="text"
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                placeholder="일정 제목을 입력하세요"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>시간</Form.Label>
              <Form.Control
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
              />
            </Form.Group>
          </Form> */}
          <div>일정 추가</div>
        </Modal.Body>
        </>
    );
  };

export default RegisterSceduleModal;