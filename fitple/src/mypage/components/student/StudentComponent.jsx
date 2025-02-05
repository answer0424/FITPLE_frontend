import React from 'react';
import { Container } from 'react-bootstrap';
import CalenderComponent from '../CalenderComponent';
import CouponComponent from '../CouponComponent';

const StudentComponent = ({ currentPage, user }) => {
    return (
        <>
        <Container>
            {currentPage === 'a' && <CalenderComponent user={user} />}
            {currentPage === 'b' && <CouponComponent user={user} />}
        </Container>
        </>
    );
};

export default StudentComponent;