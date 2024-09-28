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
    activeAllUsers: false,
    disableAllUsers: false,
    featureToggles: {
      enableFarming: false,
      enableBuyItems: false,
      enableBuyGears: false,
      enableSaveInventory: false,
      enableCompleteInventory: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const modInfoBaseUrl =
    process.env.REACT_APP_ENV === "development"
      ? process.env.REACT_APP_API_MOD_INFO_URL
      : process.env.REACT_APP_API_MOD_INFO_URL;

  const fetchModInfo = async () => {
    try {
      const response = await axios.get(modInfoBaseUrl);
      setModInfo(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching mod info");
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(modInfoBaseUrl, modInfo);
      setSuccess(true);
    } catch (error) {
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
    setModInfo({
      ...modInfo,
      featureToggles: {
        ...modInfo.featureToggles,
        [name]: checked,
      },
    });
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };

  if (loading) return <CircularProgress />; // Show loading indicator

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
                checked={modInfo.activeAllUsers}
                onChange={(e) =>
                  setModInfo({ ...modInfo, activeAllUsers: e.target.checked })
                }
              />
            }
            label="Active All Users"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={modInfo.disableAllUsers}
                onChange={(e) =>
                  setModInfo({ ...modInfo, disableAllUsers: e.target.checked })
                }
              />
            }
            label="Disable All Users"
          />
        </Box>

        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Feature Toggles
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {Object.keys(modInfo.featureToggles).map((feature) => (
            <FormControlLabel
              key={feature}
              control={
                <Checkbox
                  name={feature}
                  checked={modInfo.featureToggles[feature]}
                  onChange={handleCheckboxChange}
                />
              }
              label={feature.replace(/([A-Z])/g, " $1").trim()} // Format the label for better readability
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
