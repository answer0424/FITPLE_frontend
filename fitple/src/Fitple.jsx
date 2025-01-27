
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HBTIListpage from "./HBTIpage/pages/HBTIListpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/hbti" element={<HBTIListpage />} />

      </Routes>
    </Router>
  );
}

export default App;

