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
  Button,
} from "@mui/material";

const LOG_API =
  process.env.MANAGER_LOG_API || "http://localhost:3001/manager-logs";

const ManagerLogPage = () => {
  const [logs, setLogs] = useState([]); // Logs state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs(); // Fetch logs once when component mounts
  }, []);

  const fetchLogs = async () => {
    setLoading(true); // Start loading state
    try {
      const response = await axios.get(LOG_API);
      const fetchedLogs = response.data;

      console.log("Fetched Manager Logs:", fetchedLogs);

      // Sort logs by timestamp (latest first)
      const sortedLogs = fetchedLogs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setLogs(sortedLogs); // Set sorted logs
    } catch (err) {
      console.error("Error fetching manager logs:", err);
      setError("Failed to fetch manager logs");
    } finally {
      setLoading(false);
    }
  };

  // Function to get time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const secondsAgo = Math.floor((now - past) / 1000);

    const years = Math.floor(secondsAgo / (365 * 24 * 60 * 60));
    const months = Math.floor(
      (secondsAgo % (365 * 24 * 60 * 60)) / (30 * 24 * 60 * 60)
    );
    const days = Math.floor(
      (secondsAgo % (30 * 24 * 60 * 60)) / (24 * 60 * 60)
    );
    const hours = Math.floor((secondsAgo % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((secondsAgo % (60 * 60)) / 60);
    const seconds = secondsAgo % 60;

    const timeComponents = [];
    if (years > 0) timeComponents.push(`${years} year${years > 1 ? "s" : ""}`);
    if (months > 0)
      timeComponents.push(`${months} month${months > 1 ? "s" : ""}`);
    if (days > 0) timeComponents.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) timeComponents.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0)
      timeComponents.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (seconds > 0)
      timeComponents.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

    return `${timeComponents.join(", ")} ago`;
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box p={4} sx={{ backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#00796b" }}>
        Manager Log Operations
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchLogs}
        sx={{ mb: 2 }}
      >
        Refresh
      </Button>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#00796b", color: "#ffffff" }}>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Operation
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Entity Type
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Entity ID
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Timestamp
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Time Ago
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Public IP
              </TableCell>
              <TableCell sx={{ color: "#ffffff", fontWeight: "bold" }}>
                Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((logEntry, index) => (
              <TableRow key={index}>
                <TableCell>{logEntry.operation}</TableCell>
                <TableCell>{logEntry.entityType}</TableCell>
                <TableCell>{logEntry.entityId}</TableCell>
                <TableCell>
                  {new Date(logEntry.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{getTimeAgo(logEntry.timestamp)}</TableCell>
                <TableCell>{logEntry.publicIp || "N/A"}</TableCell>{" "}
                {/* Add Public IP */}
                <TableCell>{JSON.stringify(logEntry.details)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManagerLogPage;
