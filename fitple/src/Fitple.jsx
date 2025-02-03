import { useState } from 'react'
import './App.css'
import LoginPage from './mainpage/pages/LoginPage';
import UserRegister from './mainpage/pages/UserRegister';
import TrainerRegister from './mainpage/pages/TrainerRegister';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginContextProvider from './mainpage/contexts/LoginContextProvider';
import MainPage from './mainpage/pages/MainPage';
import QuizPage from './quizpage/pages/QuizPage';
import QuizResult from './quizpage/pages/QuizResult';



function App() {

  return (
    <>
      <BrowserRouter>
        <LoginContextProvider>
          <Routes>
            <Route path="/" Component={MainPage}></Route>
            <Route path="/login" Component={LoginPage}></Route>
            <Route path="/register/student" Component={UserRegister}></Route>
            <Route path="/register/trainer" Component={TrainerRegister}></Route>
            <Route path="/quiz" Component={QuizPage}></Route>
            <Route path="/quiz/:userId/result" Component={QuizResult}> </Route>
          </Routes>
          </LoginContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
