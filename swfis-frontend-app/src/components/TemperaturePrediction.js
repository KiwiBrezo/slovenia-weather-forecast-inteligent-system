import React, { useState } from 'react';
import axios from 'axios';

const cityCoordinates = [
  [46.55, 15.65],   // Maribor
  [46.05, 14.51],   // Ljubljana
  [46.24, 14.36],   // Kranj
  [45.55, 13.73],   // Koper
  [46.23, 15.26],   // Celje
  [45.80, 15.17],   // Novo Mesto
  [46.42, 15.87],   // Ptuj
  [46.66, 16.17]    // Murska Sobota
];

const cityNames = [
  "Maribor",
  "Ljubljana",
  "Kranj",
  "Koper",
  "Celje",
  "Novo_Mesto",
  "Ptuj",
  "Murska_Sobota"
];

const TemperaturePrediction = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [temperaturePrediction, setTemperaturePrediction] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleGetTemperature = async () => {
    setIsLoading(true);
  
    try {
      const [latitude, longitude] = cityCoordinates[cityNames.indexOf(selectedCity)];
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,windspeed_10m,winddirection_10m&forecast_days=1`;
      const response = await axios.get(apiUrl);
      const hourlyData = response.data.hourly;
  
      // Extract every 4th hour data for the next day
      const nextDayData = hourlyData.time.filter((_, index) => index % 4 === 0).map((time, index) => ({
        temperature_2m: hourlyData.temperature_2m[index],
        relativehumidity_2m: hourlyData.relativehumidity_2m[index],
        dewpoint_2m: hourlyData.dewpoint_2m[index],
        apparent_temperature: hourlyData.apparent_temperature[index],
        pressure_msl: hourlyData.pressure_msl[index],
        surface_pressure: hourlyData.surface_pressure[index],
        weathercode: hourlyData.weathercode[index],
        cloudcover: hourlyData.cloudcover[index],
        cloudcover_low: hourlyData.cloudcover_low[index],
        cloudcover_mid: hourlyData.cloudcover_mid[index],
        cloudcover_high: hourlyData.cloudcover_high[index],
        windspeed_10m: hourlyData.windspeed_10m[index],
        winddirection_10m: hourlyData.winddirection_10m[index],
      }));
  
      // Prepare payload for POST request
      const payload = nextDayData.map((item) => ({
        relativehumidity_2m: item.relativehumidity_2m,
        dewpoint_2m: item.dewpoint_2m,
        apparent_temperature: item.apparent_temperature,
        pressure_msl: item.pressure_msl,
        surface_pressure: item.surface_pressure,
        precipitation: 0.0,
        weathercode: item.weathercode,
        cloudcover: item.cloudcover,
        cloudcover_low: item.cloudcover_low,
        cloudcover_mid: item.cloudcover_mid,
        cloudcover_high: item.cloudcover_high,
        windspeed_10m: item.windspeed_10m,
        winddirection_10m: item.winddirection_10m,
      }));
  
      const apiUrlPost = `http://localhost:8000/api/predict/temperature/${selectedCity}`;
      const postResponse = await axios.post(apiUrlPost, payload);
      console.log(postResponse);
      const temperaturePredictions = postResponse.data;
  
      setTemperaturePrediction(temperaturePredictions);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className='card'>
      <select value={selectedCity} onChange={handleCityChange}>
        <option value="">Select a city</option>
        {cityNames.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      <button onClick={handleGetTemperature} disabled={!selectedCity || isLoading}>
        Get temperature prediction
      </button>
      {isLoading && <div>Loading...</div>}
      {temperaturePrediction && (
        <table>
          <thead>
            <tr>
              <th>Hour</th>
              <th>Temperature Prediction</th>
            </tr>
          </thead>
          <tbody>
          {temperaturePrediction && (
  <pre>{JSON.stringify(temperaturePrediction.prediction, null, 2)}</pre>
)}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TemperaturePrediction;
