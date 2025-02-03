import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../static/css/NoPermissionModal.css';

const NoPermissionModal = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered className="modal">
      <Modal.Header className="modal-header col-xl-12">
        <Modal.Title className=" d-flex justify-content-center align-items-center col-12">권한이 없습니다</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body d-flex justify-content-center align-items-center col-12">
        이 페이지를 보기 위한 권한이 없습니다.
      </Modal.Body>
      <Modal.Footer className="modal-footer d-flex justify-content-center">
        <Button variant="secondary" onClick={onClose} className="col-xl-4 col-md-12">
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NoPermissionModal;
