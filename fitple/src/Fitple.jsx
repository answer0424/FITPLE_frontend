import { useState } from 'react'
import './App.css'
import LoginPage from './mainpage/pages/LoginPage';
import UserRegister from './mainpage/pages/UserRegister';
import TrainerRegister from './mainpage/pages/TrainerRegister';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginContextProvider from './mainpage/contexts/LoginContextProvider';



function App() {

  return (
    <>
      <BrowserRouter>
        <LoginContextProvider>
          <Routes>
            <Route path="/" Component={LoginPage}></Route>
            <Route path="/login" Component={LoginPage}></Route>
            <Route path="/signUp/user" Component={UserRegister}></Route>
            <Route path="/signUp/trainer" Component={TrainerRegister}></Route>
          </Routes>
          </LoginContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
