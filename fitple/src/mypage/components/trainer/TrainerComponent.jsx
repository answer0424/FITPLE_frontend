import React from 'react';
import {Route, Routes} from 'react-router-dom'
import { Container } from 'react-bootstrap';
import ProfileComponent from '../ProfileComponent';
import CalenderComponent from '../CalenderComponent';
import CouponComponent from '../CouponComponent';

const TrainerComponent = ({ currentPage, user }) => {
    return (
        <>
        <Container>
            {currentPage === 'a' && <CalenderComponent user={user} />}
            {currentPage === 'b' && <CouponComponent user={user} />}
        </Container>
        </>
    );
};

export default TrainerComponent;