import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.jsx";
import TrainerProfilePage from "./mypage/pages/TrainerDetailPage";

createRoot(document.getElementById("root")).render(<TrainerProfilePage />);
