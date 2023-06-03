import "./App.css";
import React from "react";
import Layout from "./layout/Layout";

const App = () => {
  return (
    <div className="App">
      <h1>ARSO v2</h1>
      <div className="card-container">
        <Layout></Layout>
      </div>
    </div>
  );
};

export default App;
