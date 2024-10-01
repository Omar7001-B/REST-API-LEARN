import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Snackbar,
  Box,
} from "@mui/material";

const ModInfo = () => {
  const [modInfo, setModInfo] = useState({
    version: "",
    updateAvailable: false,
    discordLink: "",
    enableAll: false,
    disableAll: false,
    featureToggles: {
      farming: false,
      buyItems: false,
      buyGear: false,
      saveInventory: false,
      completeInventory: false,
    },
    dataSyncOptions: {
      onGameOpenClose: false,
      onModScreenOpen: false,
      afterCycle: false,
      afterOperation: false,
    },
    userValidationOptions: {
      onGameStart: false,
      onScreenOpen: false,
      afterCycle: false,
      afterOperation: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const modInfoBaseUrl =
    process.env.MOD_INFO_API || "http://localhost:3001/modInfo";
  const DEBUG = process.env.REACT_APP_ENV === "development";

  const log = (...args) => {
    if (DEBUG) {
      console.log(...args);
    }
  };

  log("modInfoBaseUrl:", modInfoBaseUrl);

  const fetchModInfo = async () => {
    try {
      log("Fetching mod info from:", modInfoBaseUrl); // Log the URL
      const response = await axios.get(modInfoBaseUrl);
      log("Fetched mod info:", response.data);
      setModInfo(response.data);
    } catch (error) {
      log("Error fetching mod info:", error); // Log the error
      setError("Error fetching mod info");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      log("Updating mod info:", modInfo); // Log the mod info being sent
      await axios.patch(modInfoBaseUrl, modInfo);
      setSuccess(true);
    } catch (error) {
      log("Error updating mod info:", error); // Log the error
      setError("Error updating mod info");
    }
  };

  useEffect(() => {
    fetchModInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModInfo({ ...modInfo, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [section, field] = name.split(".");
    setModInfo((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked,
      },
    }));
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  if (loading) return <CircularProgress />; // Show loading indicator
  if (error)
    return (
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    );

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Mod Settings
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Version"
          name="version"
          value={modInfo.version}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Discord Link"
          name="discordLink"
          value={modInfo.discordLink}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
        />
        <Box display="flex" justifyContent="space-between">
          <FormControlLabel
            control={
              <Checkbox
                checked={modInfo.enableAll}
                onChange={(e) =>
                  setModInfo({ ...modInfo, enableAll: e.target.checked })
                }
              />
            }
            label="Enable All"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={modInfo.disableAll}
                onChange={(e) =>
                  setModInfo({ ...modInfo, disableAll: e.target.checked })
                }
              />
            }
            label="Disable All"
          />
        </Box>

        {/* Feature Toggles */}
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Feature Toggles
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {Object.keys(modInfo.featureToggles).map((feature) => (
            <FormControlLabel
              key={feature}
              control={
                <Checkbox
                  name={`featureToggles.${feature}`}
                  checked={modInfo.featureToggles[feature]}
                  onChange={handleCheckboxChange}
                />
              }
              label={feature.replace(/([A-Z])/g, " $1").trim()} // Format the label for better readability
            />
          ))}
        </Box>

        {/* Data Sync Options */}
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Data Sync Options
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {Object.keys(modInfo.dataSyncOptions).map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  name={`dataSyncOptions.${option}`}
                  checked={modInfo.dataSyncOptions[option]}
                  onChange={handleCheckboxChange}
                />
              }
              label={option.replace(/([A-Z])/g, " $1").trim()}
            />
          ))}
        </Box>

        {/* User Validation Options */}
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          User Validation Options
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {Object.keys(modInfo.userValidationOptions).map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  name={`userValidationOptions.${option}`}
                  checked={modInfo.userValidationOptions[option]}
                  onChange={handleCheckboxChange}
                />
              }
              label={option.replace(/([A-Z])/g, " $1").trim()}
            />
          ))}
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Settings
      </Button>

      {/* Snackbar for error/success feedback */}
      <Snackbar
        open={Boolean(error) || success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || (success ? "Mod info updated successfully" : "")}
      />
    </Box>
  );
};

export default ModInfo;
