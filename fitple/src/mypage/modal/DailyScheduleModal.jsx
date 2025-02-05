import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from "react-bootstrap";
import RegisterSceduleModal from "../modal/RegisterSceduleModal";

const DailyScheduleModal = ({ isModalOpen, closeModal, addEvent, selectedDate, dailyEvents }) => {

    const [modalChange, setModalChange] = useState(false);

    useEffect(() => {
        console.log(dailyEvents)
    }, [dailyEvents]);

    return (
        <Modal show={isModalOpen} onHide={closeModal} centered>
        {user ? (
            <>
            <Modal.Header closeButton>
                <Modal.Title>일정 추가</Modal.Title>
            </Modal.Header>
            <Modal.Body></Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                닫기
                </Button>
            </Modal.Footer>
            </>
        ) : (
            <RegisterSceduleModal />
        )}
        </Modal>
    );
};

export default DailyScheduleModal;