import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import ProtectedPage from "./components/ProtectedPage";

const App = () => {
  return (
    <div className="App">
      <Router>
        <div>
          <h1 style={{ textAlign: "center" }}>ARSO v2</h1>
          <p style={{ textAlign: "center" }}>
            Welcome to ARSO v2, an application for weather data analysis and
            monitoring.
          </p>
        </div>
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
