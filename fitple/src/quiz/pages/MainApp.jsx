import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuizPageApp from '../components/base/QuizPageApp';

function MainApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/quiz" element={<QuizPageApp />} />
                {/* <Route path="/" element={<Navigate to="/quiz" replace />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default MainApp;