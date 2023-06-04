import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

// Import your components
import RainProbab from "../components/RainProbab";
import TemperaturePredict from "../components/TemperaturePrediction";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Layout() {
  return (
    <Box
      sx={{
        backgroundColor: "primary.light",
      }}
    >
      <Stack
        spacing={{ xs: 1, sm: 2, md: 4 }}
        sx={{ padding: "15px", position: "center", spacing: "2px" }}
        alignItems="center"
      >
        <Item>
          <RainProbab />
        </Item>
        <Item>
          <TemperaturePredict />
        </Item>
        <Item>
          <Link to="/protected">Go to Protected Page</Link>
        </Item>
        {/* Add more items/components as needed */}
      </Stack>
      {/* Add more items/components as needed */}
    </Box>
  );
}
