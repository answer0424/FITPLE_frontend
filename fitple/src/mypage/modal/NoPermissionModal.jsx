import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const NoPermissionModal = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>권한이 없습니다</Modal.Title>
      </Modal.Header>
      <Modal.Body>이 페이지를 보기 위한 권한이 없습니다.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NoPermissionModal;
