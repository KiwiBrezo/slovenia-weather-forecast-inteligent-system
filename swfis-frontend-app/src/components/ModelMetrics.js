import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";

function ModelMetrics() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    // Perform GET API call and update metrics state
    //const apiURL = "http://localhost:8000/api/training/metrics";
    const apiURL = `${process.env.REACT_APP_API_METRICS}`;
    fetch(apiURL)
      .then((response) => response.json())
      .then((data) => setMetrics(data.metrics))
      .catch((error) => console.log(error));
  }, []);

  const formatNumber = (number) => {
    return Number(number).toFixed(4);
  };

  const temperatureMetrics = metrics.filter(
    (metric) => metric.attribute === "temperature_2m"
  );

  const precipitationMetrics = metrics.filter(
    (metric) => metric.attribute === "precipitation"
  );

  return (
    <div>
      <TableContainer component={Paper}>
        <p> Napoved Temperature</p>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            backgroundColor: "lightblue",
            border: "3px solid gray",
            borderRadius: "8px",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">City</TableCell>

              <TableCell align="center">MAE</TableCell>
              <TableCell align="center">MSE</TableCell>
              <TableCell align="center">RMSE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {temperatureMetrics.map((metric, index) => (
              <TableRow key={index}>
                <TableCell align="center">{metric.city}</TableCell>

                <TableCell align="center">{formatNumber(metric.mae)}</TableCell>
                <TableCell align="center">{formatNumber(metric.mse)}</TableCell>
                <TableCell align="center">
                  {formatNumber(metric.rmse)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <p> Napoved Padavin</p>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            backgroundColor: "lightblue",
            border: "3px solid gray",
            borderRadius: "8px",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">City</TableCell>
              <TableCell align="center">Attribute</TableCell>
              <TableCell align="center">MAE</TableCell>
              <TableCell align="center">MSE</TableCell>
              <TableCell align="center">RMSE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {precipitationMetrics.map((metric, index) => (
              <TableRow key={index}>
                <TableCell align="center">{metric.city}</TableCell>
                <TableCell align="center">{metric.attribute}</TableCell>
                <TableCell align="center">{formatNumber(metric.mae)}</TableCell>
                <TableCell align="center">{formatNumber(metric.mse)}</TableCell>
                <TableCell align="center">
                  {formatNumber(metric.rmse)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ModelMetrics;
