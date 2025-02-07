import React, { useContext, useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { LoginContext } from "../../mainpage/contexts/LoginContextProvider";

const RegisterSceduleModal = ({
  isModalOpen,
  closeModal,
  selectedDate,
  timeInput,
  setTimeInput,
}) => {
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

  /**
   * TODO (일정등록)
   * 트레이너는 회원과 트레이닝을 할 날짜를 클릭하고 일정추가 버튼을 누르다.
   * 1. 트레이너의 유저목록이 출력된다
   * 2. 유저를 선택한다.
   * 3. 해당유저의 일정등록창 출력
   * 4. 해당유저와 트레이닝을 할 시간을 입력받는다
   * 5. 저장 버튼을 누르면 스케줄에 일정이 등록된다.
   */

  /**
   * TODO (트레이너의 스케쥴)
   * 날짜를 클릭하면 그 날에 존재하는 모든 스케쥴이 출력된다
   * 1. 각각의 리스트를 클릭하면 해당 일정 상세창이 출력된다.
   * 2. 일정 시간 전 일 때
   *  2-1 . 일정상세창 하단에 '예약 취소' 버튼 존재
   * 3. 일정 시간 당일 일 때
   *  3-1. '운동시작' 버튼과 '예약 취소' 버튼 존재
   * 4. '운동 시작' 버튼을 눌렀을 떄
   *  4-1 . '운동 종료'하기 '예약 취소'하기 버튼 존재한다
   *  4-2. ' 운동 종료' 버튼을 눌렀을 때
   *    4-2-1. '운동 시작'버튼을 누르고 30분이 지나야 운동 종료버튼이 활성화 된다.
   *            30분 이전에 운동 종료를 누르면 경고문이 출력된다
   *  4-3. '예약 취소' 버튼을 누름
   *    30분 전에는 '예약취소' 버튼을 눌러 운동을 중지할 수 있음
   */
  const { user } = useContext(LoginContext); // 현재 로그인한 유저 정보
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  useEffect(() => {
    if (isModalOpen && user) {
      api
        .get(`http://localhost:8081/member/mypage/${user.id}/register/search`)
        .then((response) => {
          if (response.status === 200) {
            console.log("data : ", response.data);
            setStudentList(response.data);
          } else {
            setStudentList([]);
          }
        })
        .catch((error) => {
          console.error("트레이너 유저 목록 불러오기 실패:", error);
          setStudentList([]);
        });
    }
  }, [isModalOpen, user]);

  return (
    <Modal show={isModalOpen} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>일정 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* 🔹 트레이너 유저 목록 출력 */}
          <Form.Group className="mb-3">
            <Form.Label>회원 선택</Form.Label>
            <Form.Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">회원 선택</option>
              {studentList.length > 0 ? (
                studentList.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))
              ) : (
                <option disabled>등록된 수강생 없음</option>
              )}
            </Form.Select>
          </Form.Group>

          {/* 🔹 일정 시간 입력 */}
          <Form.Group className="mb-3">
            <Form.Label>트레이닝 시간</Form.Label>
            <Form.Control
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
            />
          </Form.Group>

          {/* 🔹 저장 버튼 */}
          <Button variant="primary" disabled={!selectedStudent || !timeInput}>
            일정 등록
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterSceduleModal;
