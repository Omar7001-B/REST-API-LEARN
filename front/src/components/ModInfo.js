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
    enableAllUsers: false,
    disableAllUsers: false,
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

  useEffect(() => {
    const fetchModInfo = async () => {
      try {
        log("Fetching mod info from:", modInfoBaseUrl);
        const response = await axios.get(modInfoBaseUrl);
        setModInfo(response.data);
      } catch (error) {
        setError("Error fetching mod info");
        log("Error fetching mod info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModInfo();
  }, [modInfoBaseUrl]);

  const handleUpdate = async () => {
    try {
      log("Updating mod info:", modInfo);
      await axios.patch(modInfoBaseUrl, modInfo);
      setSuccess(true);
    } catch (error) {
      setError("Error updating mod info");
      log("Error updating mod info:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [section, field] = name.split(".");
    setModInfo((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: checked },
    }));
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  if (loading) return <CircularProgress />;
  if (error) {
    return (
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    );
  }

  const renderCheckboxes = (options, section) => (
    <Box display="flex" flexDirection="column" gap={1}>
      {Object.keys(options).map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              name={`${section}.${option}`}
              checked={options[option]}
              onChange={handleCheckboxChange}
            />
          }
          label={option.replace(/([A-Z])/g, " $1").trim()}
        />
      ))}
    </Box>
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
                checked={modInfo.enableAllUsers}
                onChange={(e) =>
                  setModInfo((prev) => ({
                    ...prev,
                    enableAllUsers: e.target.checked,
                  }))
                }
              />
            }
            label="Enable All Users"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={modInfo.disableAllUsers}
                onChange={(e) =>
                  setModInfo((prev) => ({
                    ...prev,
                    disableAllUsers: e.target.checked,
                  }))
                }
              />
            }
            label="Disable All"
          />
        </Box>

        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Feature Toggles
        </Typography>
        {renderCheckboxes(modInfo.featureToggles, "featureToggles")}

        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Data Sync Options
        </Typography>
        {renderCheckboxes(modInfo.dataSyncOptions, "dataSyncOptions")}

        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          User Validation Options
        </Typography>
        {renderCheckboxes(
          modInfo.userValidationOptions,
          "userValidationOptions"
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ marginTop: 2 }}
      >
        Update Settings
      </Button>

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
