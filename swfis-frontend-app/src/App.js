import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import ProtectedPage from "./components/ProtectedPage";

const App = () => {
  return (
    <div className="App">
      <Router>
        <h1>ARSO v2</h1>
        <div className="card-container">
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route path="/protected" element={<ProtectedPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
