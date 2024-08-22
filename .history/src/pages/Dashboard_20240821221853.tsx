// Dashboard.tsx

import React, { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@mantine/core";
import { ServerIpProps } from "../types"; // Adjust the path as needed

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

const Dashboard: React.FC<ServerIpProps> = ({ serverIp }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session Expired");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(serverIp + "/api/users/welcome", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Invalid Session");
        navigate("/");
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return user ? (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <nav
        style={{ padding: "1rem", backgroundColor: "#3A244A", color: "#fff" }}
        className="flex justify-between items-center"
      >
        <Typography variant="h6" component="div">
          My Dashboard
        </Typography>
        <Button variant="white" color="#3A244A" onClick={handleSignOut}>
          Sign Out
        </Button>
      </nav>

      {/* Content */}
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user.firstName} {user.lastName}!
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {user.email}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          p: 2,
          backgroundColor: "#3A244A",
          color: "#fff",
          mt: "auto",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          &copy; 2024 My Dashboard. All rights reserved.
        </Typography>
      </Box>
    </div>
  ) : (
    "loading..."
  );
};

export default Dashboard;
