import React, { useState, useEffect } from 'react';

const TemperaturePredictionRequest = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/predict/temperature/Maribor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              relativehumidity_2m: 79,
              dewpoint_2m: 9.9,
              apparent_temperature: 13.2,
              pressure_msl: 1017.7,
              surface_pressure: 988.4,
              precipitation: 0.0,
              weathercode: 1,
              cloudcover: 46,
              cloudcover_low: 1,
              cloudcover_mid: 28,
              cloudcover_high: 95,
              windspeed_10m: 2.6,
              winddirection_10m: 214,
            },
            {
              relativehumidity_2m: 49,
              dewpoint_2m: 8.9,
              apparent_temperature: 10.2,
              pressure_msl: 1117.7,
              surface_pressure: 938.4,
              precipitation: 25.0,
              weathercode: 1,
              cloudcover: 43,
              cloudcover_low: 1,
              cloudcover_mid: 22,
              cloudcover_high: 70,
              windspeed_10m: 7.2,
              winddirection_10m: 254,
            },
            {
              relativehumidity_2m: 82,
              dewpoint_2m: 15.9,
              apparent_temperature: 17.8,
              pressure_msl: 1023.7,
              surface_pressure: 932.4,
              precipitation: 0.0,
              weathercode: 1,
              cloudcover: 41,
              cloudcover_low: 1,
              cloudcover_mid: 48,
              cloudcover_high: 55,
              windspeed_10m: 19.6,
              winddirection_10m: 124,
            },
          ]),
        });
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="card">
      <h2>Temperature Prediction Request</h2>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default TemperaturePredictionRequest;
