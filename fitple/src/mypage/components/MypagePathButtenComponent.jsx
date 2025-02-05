import React from 'react';

const MypagePathButtenComponent = ({ onClick }) => {
    return (
        <div>
            <button onClick={() => onClick('a')}>Calender</button>
            <button onClick={() => onClick('b')}>Coupon</button>
        </div>
    );
};

export default MypagePathButtenComponent;