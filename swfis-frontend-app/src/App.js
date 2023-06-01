
import './App.css';
import React from 'react';
import Layout from './layout/Layout';

const App = () => {
  return (
    <div className="App">
      <h1>Weather Prediction App</h1>
      <p>Halo</p>
      <div className="card-container">
        <Layout></Layout>
      </div>
    </div>
  );
};

export default App;
