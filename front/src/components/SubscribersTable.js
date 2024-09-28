import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { CheckCircle, Cancel, Edit } from "@mui/icons-material";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/subscribers";

// Debug flag
const DEBUG = process.env.REACT_APP_ENV === "development";

const log = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

const SubscribersTable = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [newSubscriber, setNewSubscriber] = useState({
    username: "",
    expirationDate: "",
    publicIps: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      log("Fetching subscribers...");
      const response = await axios.get(API_URL);
      log("Fetched subscribers:", response.data);
      setSubscribers(response.data);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
      setError("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscriber((prev) => ({ ...prev, [name]: value }));
    log(`Input change - ${name}: ${value}`);
  };

  const [originalUsername, setOriginalUsername] = useState("");

  const handleAddOrUpdateSubscriber = async () => {
    try {
      log("Add/Update button clicked");
      log("Current newSubscriber state:", newSubscriber);

      const expirationDate =
        newSubscriber.expirationDate || new Date().toISOString().split("T")[0];

      const publicIps =
        typeof newSubscriber.publicIps === "string"
          ? newSubscriber.publicIps.split(",").map((ip) => ip.trim())
          : newSubscriber.publicIps;

      const subscriberData = {
        username: newSubscriber.username,
        expirationDate,
        publicIps,
        status: newSubscriber.status,
      };

      log("Prepared subscriber data for request:", subscriberData);

      if (originalUsername) {
        log(`Updating subscriber with original username: ${originalUsername}`);
        const response = await axios.patch(
          `${API_URL}/${originalUsername}`,
          subscriberData
        );
        log("Update response:", response.data);
      } else {
        log("Adding new subscriber");
        const response = await axios.post(API_URL, subscriberData);
        log("Add response:", response.data);
      }

      setNewSubscriber({
        username: "",
        expirationDate: "",
        publicIps: "",
        status: "Active",
      });
      setOriginalUsername("");

      fetchSubscribers();
    } catch (err) {
      console.error("Error during add/update:", err);
      setError("Failed to add/update subscriber");
    }
  };

  const handleEditSubscriber = (subscriber) => {
    const formattedDate = new Date(subscriber.expirationDate)
      .toISOString()
      .split("T")[0];

    setNewSubscriber({
      _id: subscriber._id,
      username: subscriber.username,
      expirationDate: formattedDate,
      publicIps: subscriber.publicIps.join(", "),
      status: subscriber.status,
    });

    setOriginalUsername(subscriber.username);
  };

  const handleDeleteSubscriber = async (username) => {
    try {
      log(`Deleting subscriber with ID: ${username}`);
      const response = await axios.delete(`${API_URL}/${username}`);
      log("Delete response:", response.data);
      fetchSubscribers();
    } catch (err) {
      console.error("Error deleting subscriber:", err);
      setError("Failed to delete subscriber");
    }
  };

  const calculateTimeLeft = (expirationDate) => {
    const now = new Date();
    const expiryDate = new Date(expirationDate);
    const timeDifference = expiryDate - now;

    if (timeDifference < 0) {
      return { expired: true };
    }

    const totalMinutes = Math.floor(timeDifference / (1000 * 60));
    const years = Math.floor(totalMinutes / (60 * 24 * 365));
    const months = Math.floor(
      (totalMinutes % (60 * 24 * 365)) / (60 * 24 * 30)
    );
    const days = Math.floor((totalMinutes % (60 * 24 * 30)) / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return {
      years,
      months,
      days,
      hours,
      minutes,
      expired: false,
    };
  };

  const timeLeftText = (time) => {
    const parts = [];
    if (time.years) parts.push(`${time.years}y`);
    if (time.months) parts.push(`${time.months}m`);
    if (time.days) parts.push(`${time.days}d`);
    if (time.hours) parts.push(`${time.hours}h`);
    if (time.minutes) parts.push(`${time.minutes}m`);

    return parts.join(" ") || "Expired";
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Subscribers List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Time Left</TableCell>
              <TableCell>Public IPs</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscribers.map((subscriber) => {
              const time = calculateTimeLeft(subscriber.expirationDate);
              const timeLeftDisplay = time.expired
                ? "Expired"
                : timeLeftText(time);

              return (
                <TableRow key={subscriber._id}>
                  <TableCell>{subscriber.username}</TableCell>
                  <TableCell>
                    {new Date(subscriber.expirationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {time.expired ? (
                        <Cancel color="error" />
                      ) : (
                        <CheckCircle color="success" />
                      )}
                      <Typography
                        variant="body1"
                        color={time.expired ? "error.main" : "success.main"}
                        ml={1}
                      >
                        {timeLeftDisplay}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(subscriber.publicIps) &&
                    subscriber.publicIps.length > 0
                      ? subscriber.publicIps.join(", ")
                      : "No Public IPs"}
                  </TableCell>
                  <TableCell>
                    {subscriber.status.charAt(0).toUpperCase() +
                      subscriber.status.slice(1)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        handleDeleteSubscriber(subscriber.username)
                      }
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditSubscriber(subscriber)}
                      startIcon={<Edit />}
                      sx={{ ml: 1 }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          {newSubscriber._id ? "Edit Subscriber" : "Add New Subscriber"}
        </Typography>
        <TextField
          label="Username"
          name="username"
          value={newSubscriber.username}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Expiration Date"
          name="expirationDate"
          type="date"
          value={newSubscriber.expirationDate}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Public IPs (comma-separated)"
          name="publicIps"
          value={newSubscriber.publicIps}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />
        <Select
          name="status"
          value={newSubscriber.status}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddOrUpdateSubscriber}
          fullWidth
          sx={{ mt: 2 }}
        >
          {newSubscriber._id ? "Update Subscriber" : "Add Subscriber"}
        </Button>
      </Box>
    </Box>
  );
};

export default SubscribersTable;
