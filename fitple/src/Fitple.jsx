import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./mainpage/pages/LoginPage";
import UserRegister from "./mainpage/pages/UserRegister";
import TrainerRegister from "./mainpage/pages/TrainerRegister";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginContextProvider from "./mainpage/contexts/LoginContextProvider";
import ProtectedRoute from "./common/component/ProtectedRoute";
import MainPage from "./mainpage/pages/MainPage";
import QuizPage from "./quizpage/pages/QuizPage";
import QuizResult from "./quizpage/pages/QuizResult";
import HBTIListpage from "./HBTIpage/pages/HBTIListpage";
import HBTIListDetailPage from "./HBTIpage/pages/HBTIListDetailPage";
import TrainerDetailPage from "./trainerpage/pages/TrainerDetailPage";
import MyPage from "./mypage/pages/MyPage";
import ResetPasswordPage from "./mainpage/pages/ResetPasswordPage";
import ForgotPasswordPage from "./mainpage/pages/ForgoatPasswordPage";
import TrainerDetailPageWrite from "./mypage/pages/TrainerDetailPage";
import MatchPage from "./matchpage/pages/MatchPage";


function Fitple() {

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
            <Route
              path="/quiz/:userId/result"
              element={
                <ProtectedRoute>
                  <QuizResult />
                </ProtectedRoute>
              }
            />
            <Route path="/member/*" element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            } />
            <Route path="/member/detail/write" element={
              <ProtectedRoute>
                <TrainerDetailPageWrite />
              </ProtectedRoute>
            } />
            <Route path="/trainer/:trainerId/detail" element={
              <ProtectedRoute>
                <TrainerDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:userId/result/match" element={
              <ProtectedRoute>
                <MatchPage />
              </ProtectedRoute>
            } />

            <Route path="/hbti" Component={HBTIListpage} />
            <Route path="/hbti/detail" Component={HBTIListDetailPage} />
            <Route path="member/reset-password/:userId/:uuid" Component={ResetPasswordPage}></Route>
            <Route path="/forgot-password" Component={ForgotPasswordPage}></Route>
          </Routes>

        </LoginContextProvider>
      </BrowserRouter>
    </>
  );
}

export default Fitple;
