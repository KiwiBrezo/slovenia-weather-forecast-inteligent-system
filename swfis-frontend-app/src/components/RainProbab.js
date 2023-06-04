import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import TimeIcon from "../icons/timeIcon.svg";
import PercipitationIcon from "../icons/headerDez.svg";
import SunIcon from "../icons/Sun.svg";
import SunRainIcon from "../icons/SunRain.svg";
import Droplet from "../icons/Kaplja.svg";

function createData(time, prediction, icon) {
  return { time, prediction, icon };
}

const cityCoordinates = [
  [46.55, 15.65], // Maribor
  [46.05, 14.51], // Ljubljana
  [46.24, 14.36], // Kranj
  [45.55, 13.73], // Koper
  [46.23, 15.26], // Celje
  [45.8, 15.17], // Novo Mesto
  [46.42, 15.87], // Ptuj
  [46.66, 16.17], // Murska Sobota
];

const cityNames = [
  "Maribor",
  "Ljubljana",
  "Kranj",
  "Koper",
  "Celje",
  "Novo_Mesto",
  "Ptuj",
  "Murska_Sobota",
];

const RainProbab = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [rainProbability, setRainProbability] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextDayData, setNextDayData] = useState([]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleGetPrecipitation = async (forecastDays) => {
    setIsLoading(true);

    try {
      const [latitude, longitude] =
        cityCoordinates[cityNames.indexOf(selectedCity)];

      let apiForecastDays = 1; // Default value for forecast days in API request

      if (forecastDays === 4) {
        apiForecastDays = 1;
      } else if (forecastDays === 6) {
        apiForecastDays = 3;
      } else if (forecastDays === 12) {
        apiForecastDays = 7;
      }
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,weathercode,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,windspeed_10m,winddirection_10m&forecast_days=${apiForecastDays}`;
      const response = await axios.get(apiUrl);
      const hourlyData = response.data.hourly;
      //---------------------------------------
      const groupedData = hourlyData.time.reduce((acc, time, index) => {
        const hour = time.substring(0, 13); // Extract the hour part from the time

        if (!acc[hour]) {
          acc[hour] = {
            time: [],
            temperature_2m: [],
            relativehumidity_2m: [],
            dewpoint_2m: [],
            apparent_temperature: [],
            pressure_msl: [],
            surface_pressure: [],
            weathercode: [],
            cloudcover: [],
            cloudcover_low: [],
            cloudcover_mid: [],
            cloudcover_high: [],
            windspeed_10m: [],
            winddirection_10m: [],
          };
        }

        acc[hour].time.push(time);
        acc[hour].temperature_2m.push(hourlyData.temperature_2m[index]);
        acc[hour].relativehumidity_2m.push(
          hourlyData.relativehumidity_2m[index]
        );
        acc[hour].dewpoint_2m.push(hourlyData.dewpoint_2m[index]);
        acc[hour].apparent_temperature.push(
          hourlyData.apparent_temperature[index]
        );
        acc[hour].pressure_msl.push(hourlyData.pressure_msl[index]);
        acc[hour].surface_pressure.push(hourlyData.surface_pressure[index]);
        acc[hour].weathercode.push(hourlyData.weathercode[index]);
        acc[hour].cloudcover.push(hourlyData.cloudcover[index]);
        acc[hour].cloudcover_low.push(hourlyData.cloudcover_low[index]);
        acc[hour].cloudcover_mid.push(hourlyData.cloudcover_mid[index]);
        acc[hour].cloudcover_high.push(hourlyData.cloudcover_high[index]);
        acc[hour].windspeed_10m.push(hourlyData.windspeed_10m[index]);
        acc[hour].winddirection_10m.push(hourlyData.winddirection_10m[index]);

        return acc;
      }, {});

      // Convert the grouped data into an array
      const formattedData = Object.values(groupedData);

      console.log(
        "Formatirani podatki za izbrano časovno obdobje",
        formattedData
      );

      const dnevniPodatki1dan = formattedData.filter(
        (_, index) => index % forecastDays === 0
      );
      // console.log("Pravi dnevni podatki", dnevniPodatki1dan);

      //---------------------------------------

      // Prepare payload for POST request
      const payload = dnevniPodatki1dan.map((item) => ({
        time: item.time[0], // Take the first time value
        temperature_2m: item.temperature_2m[0],
        relativehumidity_2m: item.relativehumidity_2m[0],
        dewpoint_2m: item.dewpoint_2m[0],
        apparent_temperature: item.apparent_temperature[0],
        pressure_msl: item.pressure_msl[0],
        surface_pressure: item.surface_pressure[0],
        weathercode: item.weathercode[0],
        cloudcover: item.cloudcover[0],
        cloudcover_low: item.cloudcover_low[0],
        cloudcover_mid: item.cloudcover_mid[0],
        cloudcover_high: item.cloudcover_high[0],
        windspeed_10m: item.windspeed_10m[0],
        winddirection_10m: item.winddirection_10m[0],
      }));

      //console.log("Payload RaibProbab", payload);

      const apiUrlPost = `${process.env.REACT_APP_PRECIPITATION_API_URL}${selectedCity}`;
      const postResponse = await axios.post(apiUrlPost, payload);
      console.log(postResponse);
      const precipitationProbability = postResponse.data;

      setRainProbability(precipitationProbability);
      setIsLoading(false);
      setNextDayData(dnevniPodatki1dan);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getRainProbabilityStage = (probability) => {
    if (probability <= 25) {
      return (
        <img
          src={SunIcon}
          alt="Low"
          width="100"
          height="100"
          viewBox="0 0 24 24"
        />
      ); // Replace with the appropriate icon for low probability
    } else if (probability <= 50) {
      return (
        <img
          src={SunRainIcon} //SunRain icon
          alt="Low"
          width="100"
          height="100"
          viewBox="0 0 24 24"
        />
      ); // Replace with the appropriate icon for moderate probability
    } else if (probability <= 75) {
      return "High"; // Replace with the appropriate icon for high probability
    } else {
      return "Very High"; // Replace with the appropriate icon for very high probability
    }
  };

  const formatProbability = (probability) => {
    return Math.round(probability); // Round the probability to the nearest whole number
  };

  console.log("Next day data preden se rows naredi", nextDayData);
  const rows =
    rainProbability && rainProbability.prediction && nextDayData.length > 0
      ? rainProbability.prediction.map((prediction, index) => {
          const time = nextDayData[index]?.time;
          const icon = getRainProbabilityStage(prediction);

          return createData(time, formatProbability(prediction), icon);
        })
      : [];

  console.log(rows);

  return (
    <div className="card padding-between-elements">
      <div>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="city-select-label">Select City</InputLabel>
            <Select
              labelId="city-select-label"
              id="city-select"
              value={selectedCity}
              label="Select City"
              onChange={handleCityChange}
            >
              <MenuItem value="">Choose a city</MenuItem>
              {cityNames.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ "& > *": { my: 1, mx: 0.5 } }}>
          <Button
            variant="contained"
            onClick={() => handleGetPrecipitation(4)}
            disabled={!selectedCity}
            sx={{ padding: "14px" }}
          >
            Percipitation Tomorrow
          </Button>
          <Button
            variant="contained"
            onClick={() => handleGetPrecipitation(6)}
            disabled={!selectedCity}
            className="padding-top-bottom"
            sx={{ padding: "14px" }}
          >
            Percipitation 3 Days
          </Button>
          <Button
            variant="contained"
            onClick={() => handleGetPrecipitation(12)}
            disabled={!selectedCity}
            className="padding-top-bottom"
            sx={{ padding: "14px" }}
          >
            Percipitation Week
          </Button>
        </Box>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : rainProbability &&
        rainProbability.prediction &&
        rainProbability.prediction.length > 0 ? (
        <TableContainer component={Paper}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ backgroundColor: "lightblue" }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <img
                    src={TimeIcon}
                    alt="Time"
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                  />
                </TableCell>
                <TableCell>
                  <img
                    src={Droplet}
                    alt="Time"
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                  />
                </TableCell>
                <TableCell>
                  <img
                    src={PercipitationIcon}
                    alt="Temp Prediction"
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.time}>
                  <TableCell component="th" scope="row">
                    {row.time}
                  </TableCell>
                  <TableCell>{row.prediction} %</TableCell>
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
