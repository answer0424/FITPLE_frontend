import React from 'react';
import { Container } from 'react-bootstrap';
import CalenderComponent from '../CalenderComponent';
import CouponComponent from '../student/CouponComponent';
import ProfilEditComponent from '../ProfileEditComponent';

const StudentComponent = ({ currentPage, user }) => {
    return (
        <>
        <Container>
            {currentPage === 'a' && <CalenderComponent user={user} />}
            {currentPage === 'b' && <CouponComponent user={user} />}
            {currentPage === 'c' && <ProfilEditComponent user={user} />}
        </Container>
        </>
    );
};

export default StudentComponent;