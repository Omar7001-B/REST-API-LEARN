// src/Login.js
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // Check if username and password are both "admin"
    if (username === "admin" && password === "admin") {
      onLogin(); // Call the onLogin function passed as a prop
      setError(""); // Clear any previous error
    } else {
      setError("Invalid username or password"); // Set error message
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{ backgroundColor: "#e3f2fd", padding: 2 }}
    >
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, width: 400 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", color: "#1976d2" }}
        >
          Login
        </Typography>
        {error && (
          <Typography
            color="error"
            variant="body2"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          fullWidth
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          fullWidth
          variant="outlined"
          sx={{ borderRadius: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mt: 2, borderRadius: 1, width: "100%" }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
