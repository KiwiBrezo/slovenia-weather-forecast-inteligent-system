import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MonitoringLinks from "../components/MonitoringLinks";
import ModelMetrics from "../components/ModelMetrics";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function ProtectedPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform password validation here
    // For simplicity, let's assume the password is "password123"
    if (password === "password123") {
      setIsLoggedIn(true);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  if (isLoggedIn) {
    // Render the content of the protected page
    return (
      <div>
        <Box
          sx={{
            "& > *": { my: 2, mx: 2 },
            backgroundColor: "primary.light",
          }}
        >
          <Stack
            spacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{ padding: "15px", position: "center", spacing: "2px" }}
            alignItems="center"
          >
            <Item>
              <MonitoringLinks />
            </Item>
            <Item>
              <ModelMetrics />
            </Item>

            {/* Add more items/components as needed */}
          </Stack>
          {/* Add more items/components as needed */}
        </Box>
      </div>
    );
  } else {
    // Render the login page
    const theme = createTheme();

    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default ProtectedPage;
