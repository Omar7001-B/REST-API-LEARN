import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";

const API_URL =
  process.env.REACT_APP_STATS_API || "http://localhost:3001/stats";

// Debug flag
const DEBUG = process.env.REACT_APP_ENV === "development";

const log = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

const StatisticsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      log("Fetching stats...");
      const response = await axios.get(API_URL);
      log("Fetched stats:", response.data);
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box p={4} sx={{ backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#00796b" }}>
        User Statistics
      </Typography>
      <Grid container spacing={4}>
        {stats.map((userStats) => (
          <Grid item xs={12} sm={6} md={4} key={userStats.username}>
            <Card sx={{ boxShadow: 2 }}>
              <CardHeader
                title={userStats.username}
                titleTypographyProps={{
                  variant: "h5",
                  sx: { color: "#004d40" },
                }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ color: "#00796b", mb: 2 }}>
                  Farming Stats
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "#00796b", color: "#ffffff" }}
                      >
                        <TableCell
                          sx={{ color: "#ffffff", fontWeight: "bold" }}
                        >
                          Item
                        </TableCell>
                        <TableCell
                          sx={{ color: "#ffffff", fontWeight: "bold" }}
                        >
                          Quantity
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userStats.farmingStats &&
                        Object.entries(userStats.farmingStats).map(
                          ([item, quantity]) => (
                            <TableRow
                              key={item}
                              sx={{
                                "&:nth-of-type(odd)": {
                                  backgroundColor: "#e0f2f1",
                                },
                              }}
                            >
                              <TableCell>{item}</TableCell>
                              <TableCell>{quantity}</TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography
                  variant="h6"
                  sx={{ color: "#00796b", mt: 3, mb: 2 }}
                >
                  Item Stats
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "#00796b", color: "#ffffff" }}
                      >
                        <TableCell
                          sx={{ color: "#ffffff", fontWeight: "bold" }}
                        >
                          Item
                        </TableCell>
                        <TableCell
                          sx={{ color: "#ffffff", fontWeight: "bold" }}
                        >
                          Quantity
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userStats.itemStats &&
                        Object.entries(userStats.itemStats).map(
                          ([item, quantity]) => (
                            <TableRow
                              key={item}
                              sx={{
                                "&:nth-of-type(odd)": {
                                  backgroundColor: "#e0f2f1",
                                },
                              }}
                            >
                              <TableCell>{item}</TableCell>
                              <TableCell>{quantity}</TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography
                  variant="h6"
                  sx={{ color: "#00796b", mt: 3, mb: 2 }}
                >
                  Gear Stats
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{ backgroundColor: "#00796b", color: "#ffffff" }}
                      >
                        <TableCell
                          sx={{ color: "#ffffff", fontWeight: "bold" }}
                        >
                          Gear
                        </TableCell>
                        <TableCell
                          sx={{ color: "#ffffff", fontWeight: "bold" }}
                        >
                          Quantity
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userStats.gearStats &&
                        Object.entries(userStats.gearStats).map(
                          ([item, quantity]) => (
                            <TableRow
                              key={item}
                              sx={{
                                "&:nth-of-type(odd)": {
                                  backgroundColor: "#e0f2f1",
                                },
                              }}
                            >
                              <TableCell>{item}</TableCell>
                              <TableCell>{quantity}</TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatisticsPage;
