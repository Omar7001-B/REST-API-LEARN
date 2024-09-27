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
} from "@mui/material";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/subscribers"; // Default for safety

const SubscribersTable = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [newSubscriber, setNewSubscriber] = useState({
    username: "",
    expirationDate: "",
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
    setNewSubscriber({ ...newSubscriber, [e.target.name]: e.target.value });
  };

  const handleAddSubscriber = async () => {
    try {
      await axios.post(API_URL, newSubscriber);
      setNewSubscriber({ username: "", expirationDate: "" });
      fetchSubscribers();
    } catch (err) {
      setError("Failed to add subscriber");
    }
  };

  const handleDeleteSubscriber = async (username) => {
    try {
      await axios.delete(`${API_URL}/${username}`);
      fetchSubscribers();
    } catch (err) {
      setError("Failed to delete subscriber");
    }
  };

  if (loading) return <CircularProgress />; // Show loading spinner
  if (error) return <Alert severity="error">{error}</Alert>; // Show error message

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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber._id}>
                <TableCell>{subscriber.username}</TableCell>
                <TableCell>
                  {new Date(subscriber.expirationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteSubscriber(subscriber.username)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Add New Subscriber
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSubscriber}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Subscriber
        </Button>
      </Box>
    </Box>
  );
};

export default SubscribersTable;
