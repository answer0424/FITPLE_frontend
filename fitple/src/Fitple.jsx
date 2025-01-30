
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HBTIListpage from "./HBTIpage/pages/HBTIListpage";
import HBTIListDetailPage from "./HBTIpage/pages/HBTIListDetailPage";
import TrainerDetailPage from "./trainerpage/pages/TrainerDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hbti" element={<HBTIListpage />} />
        <Route path="/hbti/detail" element={<HBTIListDetailPage />} /> 
        <Route path="/trainer/:trainerId/detail" element={<TrainerDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;

