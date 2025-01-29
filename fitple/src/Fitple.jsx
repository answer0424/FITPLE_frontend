import { useState } from "react";
import "./App.css";

function Fitple() {
  return (
    <>
      <BrowserRouter>
        <LoginContextProvider>
          <Routes>
            <Route path="/" Component={MainPage}></Route>
            <Route path="/login" Component={LoginPage}></Route>
            <Route path="/register/user" Component={UserRegister}></Route>
            <Route path="/register/trainer" Component={TrainerRegister}></Route>
          </Routes>
          </LoginContextProvider>
      </BrowserRouter>
    </>
  );
}

export default Fitple;
