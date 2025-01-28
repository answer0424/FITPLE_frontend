
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HBTIListpage from "./HBTIpage/pages/HBTIListpage";
import HBTIListDetailPage from "./HBTIpage/pages/HBTIListDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hbti" element={<HBTIListpage />} />
        <Route path="/hbti/detail" element={<HBTIListDetailPage />} /> {/* 상세 페이지 */}

      </Routes>
    </Router>
  );
}

export default App;

