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

const SubscribersTable = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [newSubscriber, setNewSubscriber] = useState({
    username: "",
    expirationDate: "",
    publicIps: "",
    status: "Active", // Default to "Active" for new subscribers
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setSubscribers(response.data);
    } catch (err) {
      setError("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscriber((prev) => ({ ...prev, [name]: value }));
    console.log(`Input changed: ${name} = ${value}`); // Log the input change
  };

  const handleAddOrUpdateSubscriber = async () => {
    try {
      const currentDate = new Date();
      const expirationDate =
        newSubscriber.expirationDate ||
        new Date(currentDate.setDate(currentDate.getDate() + 7))
          .toISOString()
          .split("T")[0];

      const subscriberData = {
        username: newSubscriber.username,
        expirationDate: expirationDate,
        publicIps: newSubscriber.publicIps.split(",").map((ip) => ip.trim()),
        status: newSubscriber.status, // Ensure status is correctly set
      };

      console.log("Subscriber Data to be sent:", subscriberData); // Log the data being sent

      if (newSubscriber._id) {
        await axios.put(`${API_URL}/${newSubscriber.username}`, subscriberData);
      } else {
        await axios.post(API_URL, subscriberData);
      }

      // Resetting state after adding/updating
      setNewSubscriber({
        username: "",
        expirationDate: "",
        publicIps: "",
        status: "Active", // Resetting back to default
      });
      fetchSubscribers();
    } catch (err) {
      setError("Failed to add/update subscriber");
    }
  };

  const handleEditSubscriber = (subscriber) => {
    setNewSubscriber({
      ...subscriber,
      status:
        subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1), // Ensure status is capitalized
    });
  };

  const handleDeleteSubscriber = async (username) => {
    try {
      await axios.delete(`${API_URL}/${username}`);
      fetchSubscribers();
    } catch (err) {
      setError("Failed to delete subscriber");
    }
  };

  const calculateTimeLeft = (expirationDate) => {
    const now = new Date();
    const expiryDate = new Date(expirationDate);
    const timeDifference = expiryDate - now;

    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return { daysLeft, hoursLeft, expired: timeDifference < 0 };
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
              const { daysLeft, hoursLeft, expired } = calculateTimeLeft(
                subscriber.expirationDate
              );
              const timeLeftText = expired
                ? `Expired ${Math.abs(daysLeft)}d ${Math.abs(hoursLeft)}h`
                : `${Math.abs(daysLeft)}d ${Math.abs(hoursLeft)}h`;

              return (
                <TableRow key={subscriber._id}>
                  <TableCell>{subscriber.username}</TableCell>
                  <TableCell>
                    {new Date(subscriber.expirationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {expired ? (
                        <Cancel color="error" />
                      ) : (
                        <CheckCircle color="success" />
                      )}
                      <Typography
                        variant="body1"
                        color={expired ? "error.main" : "success.main"}
                        ml={1}
                      >
                        {timeLeftText}
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
                    {" " /* Display formatted status */}
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
          margin="normal"
        />
        <TextField
          label="Expiration Date"
          name="expirationDate"
          type="date"
          value={newSubscriber.expirationDate}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Public IPs (comma-separated)"
          name="publicIps"
          value={newSubscriber.publicIps}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Select
          name="status"
          value={newSubscriber.status}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          fullWidth
          margin="normal"
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
