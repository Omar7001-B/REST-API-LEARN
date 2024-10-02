import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const API_URL =
  process.env.REACT_APP_SUSBCRIBERS_API || "http://localhost:3001/subscribers";

// Debug flag
const DEBUG = process.env.REACT_APP_ENV === "development";

const log = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

const PeersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
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

  // Group subscribers by public IP
  const groupByPublicIp = (subscribers) => {
    const grouped = {};
    subscribers.forEach((subscriber) => {
      subscriber.publicIps.forEach((ip) => {
        if (!grouped[ip]) {
          grouped[ip] = [];
        }
        grouped[ip].push(subscriber);
      });
    });
    return grouped;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const groupedSubscribers = groupByPublicIp(subscribers);

  return (
    <Box p={4} sx={{ backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#00796b" }}>
        Peers by Public IP
      </Typography>
      {Object.entries(groupedSubscribers).map(([ip, users]) => (
        <Box
          key={ip}
          mb={4}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 1,
            p: 2,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: "#004d40" }}>
            IP: {ip}
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#00796b", color: "#ffffff" }}>
                  <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                    Username
                  </TableCell>
                  <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                    Expiration Date
                  </TableCell>
                  <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((subscriber) => (
                  <TableRow
                    key={subscriber._id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#e0f2f1" },
                    }}
                  >
                    <TableCell>{subscriber.username}</TableCell>
                    <TableCell>
                      {new Date(subscriber.expirationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {subscriber.status.charAt(0).toUpperCase() +
                        subscriber.status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default PeersPage;
