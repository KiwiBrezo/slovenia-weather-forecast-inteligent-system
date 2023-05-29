
import './App.css';
import React from 'react';
import RootRequest from './components/RootRequest';
import CityListRequest from './components/CityListRequest';
import TemperaturePredictionRequest from './components/TemperaturePredictionRequest';
import RainProbab from './components/RainProbab';

const App = () => {
  return (
    <div className="App">
      <h1>Weather Prediction App</h1>
      <div className="card-container">
        <RainProbab></RainProbab>
        <RootRequest />
        <CityListRequest />
        <TemperaturePredictionRequest />
      </div>
    </div>
  );
};

export default App;
