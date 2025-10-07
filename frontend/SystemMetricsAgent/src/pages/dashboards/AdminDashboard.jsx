import {
  Box,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [producers, setProducers] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  // Mock admin user (replace with localStorage or API if needed)
  const adminUser = JSON.parse(localStorage.getItem("user")) || {
    username: "AdminUser",
    role: "admin",
    id: "ADM001",
  };

  // Simulate fetching connected producers and consumers
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducers([
        { id: "P1", username: "ProducerUser1", hostname: "Prod-PC-1" },
        { id: "P2", username: "ProducerUser2", hostname: "Prod-PC-2" },
      ]);
      setConsumers([
        { id: "C1", username: "ConsumerUser1", hostname: "Cons-PC-1" },
        { id: "C2", username: "ConsumerUser2", hostname: "Cons-PC-2" },
        { id: "C3", username: "ConsumerUser3", hostname: "Cons-PC-3" },
      ]);
      setStatusMessage("Connected users loaded successfully!");
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login?role=admin";
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ boxShadow: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            ⚙️ Admin Dashboard
          </Typography>
          <Box display="flex" alignItems="center" gap={3}>
            <Typography variant="body1">
              {adminUser.username} ({adminUser.role})
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              ID: {adminUser.id}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        py={6}
        px={3}
        gap={4}
      >
        {loading ? (
          <Box textAlign="center" mt={10}>
            <CircularProgress />
            <Typography mt={2}>Loading connected users...</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold">
              Connected Users Overview
            </Typography>

            {/* Producers */}
            <Paper
              elevation={3}
              sx={{ width: "90%", maxWidth: 600, p: 3, borderRadius: 2 }}
            >
              <Typography variant="h6" mb={2}>
                🟢 Producers ({producers.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {producers.map((p) => (
                  <ListItem key={p.id}>
                    <ListItemText
                      primary={`${p.username} (${p.hostname})`}
                      secondary={`ID: ${p.id}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Consumers */}
            <Paper
              elevation={3}
              sx={{ width: "90%", maxWidth: 600, p: 3, borderRadius: 2 }}
            >
              <Typography variant="h6" mb={2}>
                🔵 Consumers ({consumers.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {consumers.map((c) => (
                  <ListItem key={c.id}>
                    <ListItemText
                      primary={`${c.username} (${c.hostname})`}
                      secondary={`ID: ${c.id}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Status Message */}
            {statusMessage && (
              <Typography
                color="success.main"
                fontWeight="bold"
                mt={2}
                textAlign="center"
              >
                {statusMessage}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
