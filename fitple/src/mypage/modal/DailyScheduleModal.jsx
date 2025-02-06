import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from "react-bootstrap";
import RegisterSceduleModal from "../modal/RegisterSceduleModal";
import DailyItem from '../items/DailyItem';

const DailyScheduleModal = ({ isModalOpen, closeModal, selectedDate, dailyEvents, user }) => {

    const [modalChange, setModalChange] = useState(true);
    
    //모달 변경
    const handleModalChange= () => {
        setModalChange(prev => !prev);
    }
    //모달 닫히면 스케줄 창 보여주도록 변경
    useEffect(() => {
        if(!isModalOpen) setModalChange(true)
    }, [isModalOpen])

    return (
        <Modal show={isModalOpen} onHide={closeModal} centered>
            <Modal.Header>
                <Modal.Title>
                    {modalChange ? "스케줄" : "일정 등록"}
                </Modal.Title>
                {user.authority === "ROLE_TRAINER" ? (
                    <Button variant="primary" onClick={handleModalChange}>
                    {modalChange ? "일정 추가" : "스케줄"}
                    </Button>
                ) : (
                    <div></div>
                ) }
            </Modal.Header>
        {user ? (
            modalChange ? (
                <Modal.Body>
                    {dailyEvents.map((event, index) => (
                        <DailyItem event={event} key={index}/>
                    ))}
                </Modal.Body>
            ) : (
                <RegisterSceduleModal />
            )
        ) : (
            <div>잠시만 기다리세요...</div>
        )}
        <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
            닫기
        </Button>
        </Modal.Footer>
        </Modal>

    );
};

export default DailyScheduleModal;