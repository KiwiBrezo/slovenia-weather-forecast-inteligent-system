import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const MonitoringLinks = () => {
  const links = [
    {
      name: "Celje",
      url: "https://swfis-data-drift-celje.netlify.app/",
    },
    {
      name: "Koper",
      url: "https://swfis-data-drift-koper.netlify.app/",
    },
    {
      name: "Kranj",
      url: "https://swfis-data-drift-kranj.netlify.app/",
    },
    {
      name: "Ljubljana",
      url: "https://swfis-data-drift-ljubljana.netlify.app/",
    },
    {
      name: "Maribor",
      url: "https://swfis-data-drift-maribor.netlify.app/",
    },
    {
      name: "Murska Sobota",
      url: "https://swfis-data-drift-murska-sobota.netlify.app/",
    },
    {
      name: "Novo Mesto",
      url: "https://swfis-data-drift-novo-mesto.netlify.app/",
    },
    {
      name: "Ptuj",
      url: "https://swfis-data-drift-ptuj.netlify.app/",
    },
    // Add more cities and links here
  ];

  return (
    <div
      style={{
        display: "flex",
        background: "#f8f8f8",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Data Drift Monitoring</h2>

        <Box sx={{ "& > *": { my: 1, mx: 2 } }}>
          {links.map((link) => (
            <Button
              key={link.name}
              component={Link}
              to={link.url}
              variant="contained"
              color="success"
              style={{ marginBottom: "10px" }}
            >
              {link.name}
            </Button>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default MonitoringLinks;
