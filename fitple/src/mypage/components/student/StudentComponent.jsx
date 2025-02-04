import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Container } from 'react-bootstrap';
import ProfileComponent from '../ProfileComponent';
import CalenderComponent from '../CalenderComponent';
import CouponComponent from '../CouponComponent';

const StudentComponent = ({ user }) => {
    return (
        <>
        <div>dasdasdasd</div>
        <Container>
            <Routes>
                <Route path='Calender' Component={CalenderComponent}></Route>
                <Route path='Coupon' Component={CouponComponent}></Route>
                <Route index element={<CalenderComponent />} />
            </Routes>
        </Container>
        </>
    );
};

export default StudentComponent;