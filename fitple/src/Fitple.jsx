import { useState } from 'react'
import './App.css'
import LoginPage from './mainpage/pages/LoginPage';
import UserRegister from './mainpage/pages/UserRegister';
import TrainerRegister from './mainpage/pages/TrainerRegister';
import { BrowserRouter, Route, Routes } from 'react-router-dom';



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={LoginPage}></Route>
          <Route path="/login" Component={LoginPage}></Route>
          <Route path="/signUp/user" Component={UserRegister}></Route>
          <Route path="/signUp/trainer" Component={TrainerRegister}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
