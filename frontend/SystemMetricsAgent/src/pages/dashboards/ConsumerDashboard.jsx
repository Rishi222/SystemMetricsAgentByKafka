import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useEffect } from "react";

export default function ConsumerDashboard() {
  const [ipInfo, setIpInfo] = useState(null);
  const [producerLink, setProducerLink] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [connectedProducers, setConnectedProducers] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock user info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {
    username: "ConsumerUser",
    role: "consumer",
    id: "CON123",
  };

  // Fetch consumer's IP info
  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const res = await fetch("http://localhost:3000/ipinfo");
        if (!res.ok) throw new Error("Failed to fetch IP info");
        const data = await res.json();
        setIpInfo(data);
      } catch (err) {
        console.error("❌ Error fetching IP info:", err);
        setStatusMessage("Failed to fetch IP info.");
      } finally {
        setLoading(false);
      }
    };

    fetchIpInfo();

    // Simulate producer connections (testing only)
    const timer = setTimeout(() => {
      setConnectedProducers([
        { hostname: "Producer-1", ip: "192.168.0.23" },
        { hostname: "Producer-2", ip: "192.168.0.45" },
      ]);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Manual producer connection
  const handleConnectProducer = () => {
    if (!producerLink) {
      setStatusMessage("Please enter producer link!");
      return;
    }

    setIsConnecting(true);
    setStatusMessage("Connecting to producer...");

    // Simulated connection delay
    setTimeout(() => {
      const newProducer = {
        hostname: `Producer-${connectedProducers.length + 1}`,
        ip: `192.168.0.${connectedProducers.length + 10}`,
      };
      setConnectedProducers((prev) => [...prev, newProducer]);
      setStatusMessage("Producer connected successfully!");
      setIsConnecting(false);
    }, 1500);
  };

  // Copy consumer link
  const handleCopyConsumerLink = () => {
    if (!ipInfo) return;
    const consumerLink = `http://${ipInfo.ip}:5000`;
    navigator.clipboard.writeText(consumerLink);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login?role=consumer";
  };

  // Loading state
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Loading Consumer Info...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Navbar */}
      <AppBar position="static" color="primary" sx={{ boxShadow: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            ⚙️ Consumer Dashboard
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

      {/* Consumer Info */}
      {ipInfo && (
        <Box
          mt={4}
          mx="auto"
          p={3}
          width="70%"
          border="1px solid #ccc"
          borderRadius={2}
          bgcolor="#fafafa"
          boxShadow={2}
        >
          <Typography variant="h5" mb={2} textAlign="center">
            🖥️ Consumer Information
          </Typography>
          <Typography>Hostname: {ipInfo.hostname}</Typography>
          <Typography>IP Address: {ipInfo.ip}</Typography>
          <Typography>MAC: {ipInfo.mac}</Typography>
          <Typography>Interface: {ipInfo.iface}</Typography>
          <Typography>Type: {ipInfo.type}</Typography>

          {/* Connection Link */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
              gap: 1,
            }}
          >
            <Typography variant="body1">
              Connection Link: <strong>{`http://${ipInfo.ip}:5000`}</strong>
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopyConsumerLink}
              endIcon={<ContentCopyIcon />}
            >
              Copy
            </Button>
            {copySuccess && (
              <Typography color="green" variant="body2">
                {copySuccess}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Connect Producer Input */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={4}
        gap={2}
      >
        <Typography variant="h6">
          Connect to a Producer (Enter Producer Link)
        </Typography>
        <TextField
          label="Producer Link"
          value={producerLink}
          onChange={(e) => setProducerLink(e.target.value)}
          sx={{ width: "50%" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnectProducer}
          disabled={isConnecting}
        >
          {isConnecting ? <CircularProgress size={24} /> : "Connect"}
        </Button>

        {statusMessage && (
          <Typography
            color={
              statusMessage.toLowerCase().includes("success")
                ? "success.main"
                : "error.main"
            }
          >
            {statusMessage}
          </Typography>
        )}
      </Box>

      {/* Connected Producers */}
      <Box
        mt={4}
        mx="auto"
        p={3}
        width="70%"
        border="1px solid #ccc"
        borderRadius={2}
        bgcolor="#f0f0f0"
        boxShadow={1}
      >
        <Typography variant="h6" mb={2}>
          Producer Connection Status:
        </Typography>

        {connectedProducers.length === 0 ? (
          <Typography color="text.secondary" mt={1}>
            🔴 Waiting for producers to connect...
          </Typography>
        ) : (
          <>
            <Typography color="green" mt={1}>
              🟢 {connectedProducers.length} Producer(s) Connected
            </Typography>
            <Box sx={{ mt: 2 }}>
              {connectedProducers.map((p, index) => (
                <Typography key={index}>
                  • {p.hostname} ({p.ip})
                </Typography>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
