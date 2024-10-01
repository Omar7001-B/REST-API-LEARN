// src/Home.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, Outlet } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" height="100vh" sx={{ backgroundColor: "#e0f7fa" }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 250,
          backgroundColor: "#ffffff",
          borderRight: "1px solid #ccc",
          padding: 2,
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Ensures the sidebar stretches with content
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ marginBottom: 2, color: "#00796b" }}>
            Falcon Farm
          </Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{
              marginBottom: 1,
              backgroundColor: "#00796b",
              color: "#fff",
              "&:hover": { backgroundColor: "#004d40" },
            }}
            onClick={() => navigate("/subscribers")}
          >
            Subscribers
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              marginBottom: 1,
              backgroundColor: "#00796b",
              color: "#fff",
              "&:hover": { backgroundColor: "#004d40" },
            }}
            onClick={() => navigate("/settings")}
          >
            Settings
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              marginBottom: 1,
              backgroundColor: "#00796b",
              color: "#fff",
              "&:hover": { backgroundColor: "#004d40" },
            }}
            onClick={() => navigate("/peers")}
          >
            Peers
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              marginBottom: 1,
              backgroundColor: "#00796b",
              color: "#fff",
              "&:hover": { backgroundColor: "#004d40" },
            }}
            onClick={() => navigate("/statistics")}
          >
            Statistics
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        sx={{
          backgroundColor: "#f5f5f5",
          padding: 3,
          overflowY: "auto", // Allows scrolling if content exceeds the viewport height
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, color: "#00796b" }}>
          Welcome to Falcon Farm
        </Typography>
        <Outlet /> {/* This will render the currently selected route */}
      </Box>
    </Box>
  );
};

export default Home;
