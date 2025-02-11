import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Container } from 'react-bootstrap';
import ProfileComponent from '../ProfileComponent';
import CalenderComponent from '../CalenderComponent';
import CouponComponent from '../CouponComponent';

const TrainerComponent = () => {
    return (
        <>
        <ProfileComponent/>
        <BrowserRouter>
        <Container>
            <Routes>
                <Route path='/Calender' Component={CalenderComponent}></Route>
                <Route path='/Coupon' Component={CouponComponent}></Route>
            </Routes>
        </Container>
        </BrowserRouter>
        </>
    );
};

export default TrainerComponent;