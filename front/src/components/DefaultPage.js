// src/components/DefaultPage.js
import React from "react";
import { Box, Typography } from "@mui/material";

const DefaultPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ padding: 2, maxWidth: 600, margin: "0 auto", overflow: "hidden" }}
    >
      <img
        src="/wallpaper.png" // Directly reference the image from the public folder
        alt="Falcon Farm"
        style={{ width: "100%", height: "auto", marginBottom: 16 }} // Full width to prevent overflow
      />
      <Typography variant="h5" gutterBottom>
        Falcon Farm Mod
      </Typography>
      <Typography variant="body1" gutterBottom>
        🛠️ A Minecraft Box PvP mod that helps you automatically farm items and
        gear up quickly.
      </Typography>
      <Typography variant="body1" gutterBottom>
        📥 To get the mod, fill out the form 📑 and send it to me privately.
        It’s only for trusted players. 🤝
      </Typography>
    </Box>
  );
};

export default DefaultPage;
