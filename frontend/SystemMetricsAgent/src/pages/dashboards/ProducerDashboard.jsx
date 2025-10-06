import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  Paper,
  Divider,
} from "@mui/material";
import { useState } from "react";
import LinkIcon from "@mui/icons-material/Link";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ProducerDashboard() {
  const [link, setLink] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [systemData, setSystemData] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Mock user info (replace with localStorage if needed)
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "ProducerUser",
    role: "producer",
    id: "123ABC",
  };

  const handleLinkSubmit = async () => {
    if (!link.trim()) {
      setStatusMessage("Please enter a valid consumer link!");
      return;
    }

    setIsSending(true);
    setStatusMessage("Connecting to consumer...");

    try {
      const res = await fetch("/send-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostname: "demo-host" }), // Sample payload
      });

      const data = await res.json();
      if (res.ok) {
        setSystemData(data.received);
        setStatusMessage("✅ Data sent successfully!");
      } else {
        setStatusMessage(data.error || "❌ Failed to send data.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("⚠️ Connection error!");
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login?role=producer";
  };

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      {/* Top Navbar */}
      <AppBar position="static" color="primary" sx={{ boxShadow: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            ⚙️ Producer Dashboard
          </Typography>
          <Box display="flex" alignItems="center" gap={3}>
            <Typography variant="body1">
              {user.username} ({user.role})
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              ID: {user.id}
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
        justifyContent="center"
        py={8}
        px={3}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 600,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Connect to Consumer
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Paste the <b>consumer link</b> below to establish a connection.
          </Typography>

          <TextField
            fullWidth
            label="Consumer Link"
            placeholder="https://consumer-system-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            InputProps={{
              startAdornment: <LinkIcon sx={{ color: "gray", mr: 1 }} />,
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontWeight: "bold" }}
            startIcon={<CloudUploadIcon />}
            onClick={handleLinkSubmit}
            disabled={isSending}
          >
            {isSending ? <CircularProgress size={24} /> : "Connect"}
          </Button>

          {statusMessage && (
            <Typography
              mt={3}
              sx={{
                color: statusMessage.includes("✅")
                  ? "success.main"
                  : statusMessage.includes("⚠️")
                  ? "warning.main"
                  : "error.main",
                fontWeight: "bold",
              }}
            >
              {statusMessage}
            </Typography>
          )}
        </Paper>

        {/* Divider */}
        {systemData && <Divider sx={{ my: 5, width: "60%" }} />}

        {/* Result Section */}
        {systemData && (
          <Paper
            elevation={2}
            sx={{
              mt: 3,
              p: 3,
              width: "90%",
              maxWidth: 800,
              borderRadius: 2,
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              📦 Producer Side Result
            </Typography>
            <pre
              style={{
                background: "#f4f4f4",
                padding: "1rem",
                borderRadius: "8px",
                maxHeight: "400px",
                overflowY: "auto",
                textAlign: "left",
              }}
            >
              {JSON.stringify(systemData, null, 2)}
            </pre>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
