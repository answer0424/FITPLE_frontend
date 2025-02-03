<<<<<<< HEAD
<<<<<<< HEAD

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
import HBTIListpage from "./HBTIpage/pages/HBTIListpage";
import HBTIListDetailPage from "./HBTIpage/pages/HBTIListDetailPage";
import TrainerDetailPage from "./trainerpage/pages/TrainerDetailPage";


=======
import { useState } from "react";
import "./App.css";
import LoginPage from "./mainpage/pages/LoginPage";
import UserRegister from "./mainpage/pages/UserRegister";
import TrainerRegister from "./mainpage/pages/TrainerRegister";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider from "./mainpage/contexts/LoginContextProvider";
import MainPage from "./mainpage/pages/MainPage";
import ResetPasswordPage from "./mainpage/pages/ResetPasswordPage";
import ForgotPasswordPage from "./mainpage/pages/ForgoatPasswordPage";
>>>>>>> ResetPassword






=======
import { useState } from "react";
import "./App.css";
import LoginPage from "./mainpage/pages/LoginPage";
import UserRegister from "./mainpage/pages/UserRegister";
import TrainerRegister from "./mainpage/pages/TrainerRegister";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider from "./mainpage/contexts/LoginContextProvider";
import MainPage from "./mainpage/pages/MainPage";
import TrainerDetailPage from "./mypage/pages/TrainerDetailPage";
>>>>>>> TrainerDetailPage

function App() {
  return (

    <>
      <BrowserRouter>
        <LoginContextProvider>
          <Routes>
            <Route path="/" Component={MainPage}></Route>
            <Route path="/login" Component={LoginPage}></Route>
            <Route path="/register/user" Component={UserRegister}></Route>
            <Route path="/register/trainer" Component={TrainerRegister}></Route>
<<<<<<< HEAD
<<<<<<< HEAD
            <Route path="/quiz" Component={QuizPage}></Route>
            <Route path="/quiz/:userId/result" Component={QuizResult}> </Route>
            <Route path="/hbti" element={<HBTIListpage />} />
             <Route path="/hbti/detail" element={<HBTIListDetailPage />} /> 
            <Route path="/trainer/:trainerId/detail" element={<TrainerDetailPage />} />
=======
            <Route
              path="/member/detail/write"
              Component={TrainerDetailPage}
            ></Route>
>>>>>>> TrainerDetailPage
=======
            <Route path="/reset-password" Component={ResetPasswordPage}></Route>
            <Route
              path="/forgot-password"
              Component={ForgotPasswordPage}
            ></Route>
>>>>>>> ResetPassword
          </Routes>
        </LoginContextProvider>
      </BrowserRouter>
    </>
<<<<<<< HEAD
<<<<<<< HEAD
  )

}

export default App;

=======
  );
}

export default App;
>>>>>>> TrainerDetailPage
=======
  );
}

export default App;
>>>>>>> ResetPassword
