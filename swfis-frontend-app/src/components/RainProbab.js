import React, { useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/styles';


function createData(time, prediction, icon) {
  return { time, prediction, icon };
}

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

const RainProbab = () => {

  const [selectedCity, setSelectedCity] = useState('');
  const [rainProbability, setRainProbability] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextDayData, setNextDayData] = useState([]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleGetPrecipitation = async () => {
    setIsLoading(true);

    try {
      const [latitude, longitude] = cityCoordinates[cityNames.indexOf(selectedCity)];
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,windspeed_10m,winddirection_10m&forecast_days=1`;
      const response = await axios.get(apiUrl);
      const hourlyData = response.data.hourly;

      // Extract every 4th hour data for the next day
      const nextDayData = hourlyData.time.filter((_, index) => index % 4 === 0).map((time, index) => ({
        time: hourlyData.time[index],
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
        temperature_2m: item.temperature_2m,
        relativehumidity_2m: item.relativehumidity_2m,
        dewpoint_2m: item.dewpoint_2m,
        apparent_temperature: item.apparent_temperature,
        pressure_msl: item.pressure_msl,
        surface_pressure: item.surface_pressure,
        weathercode: item.weathercode,
        cloudcover: item.cloudcover,
        cloudcover_low: item.cloudcover_low,
        cloudcover_mid: item.cloudcover_mid,
        cloudcover_high: item.cloudcover_high,
        windspeed_10m: item.windspeed_10m,
        winddirection_10m: item.winddirection_10m,
      }));

      const apiUrlPost = `http://localhost:8000/api/predict/precipitation/${selectedCity}`;
      const postResponse = await axios.post(apiUrlPost, payload);
      console.log(postResponse);
      const precipitationProbability = postResponse.data;

      setRainProbability(precipitationProbability);
      setIsLoading(false);
      setNextDayData(nextDayData);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const rows = rainProbability && rainProbability.prediction
    ? rainProbability.prediction.map((prediction, index) => {
        const time = nextDayData.time;
        const icon = 'Icon'; // Replace with the appropriate icon component or element

        return createData(time, prediction, icon);
      })
    : [];

    console.log(rows)

  return (
    <div className="card">
      <div>
        <label>Select City:</label>
        <select value={selectedCity} onChange={handleCityChange}>
          <option value="">Choose a city</option>
          {cityNames.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <button onClick={handleGetPrecipitation} disabled={!selectedCity}>
          Get Rain Probability
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : rainProbability && rainProbability.prediction && rainProbability.prediction.length > 0 ? (
        <TableContainer component={Paper}>
         <Table sx={{ backgroundColor: 'lightblue' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Prediction</TableCell>
                <TableCell>Icon</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.time}>
                  <TableCell component="th" scope="row">
                    {row.time}
                  </TableCell>
                  <TableCell>{row.prediction}</TableCell>
                  <TableCell>{row.icon}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No rain probability data available</p>
      )}
     </div>
  );
};

export default RainProbab;