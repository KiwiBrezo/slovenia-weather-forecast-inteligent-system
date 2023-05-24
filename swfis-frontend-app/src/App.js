
import './App.css';
import React from 'react';
import RootRequest from './components/RootRequest';
import CityListRequest from './components/CityListRequest';
import TemperaturePredictionRequest from './components/TemperaturePredictionRequest';

const App = () => {
  return (
    <div className="App">
      <h1>Weather Prediction App</h1>
      <div className="card-container">
        <RootRequest />
        <CityListRequest />
        <TemperaturePredictionRequest />
      </div>
    </div>
  );
};

export default App;
