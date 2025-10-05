import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const roleFromURL =
    new URLSearchParams(location.search).get("role") || "producer";

  const [role, setRole] = useState(roleFromURL);
  const [message, setMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.username && formData.email && formData.password) {
      // mock signup success logic
      const newUser = {
        username: formData.username,
        email: formData.email,
        role: role,
        token: "signupMockToken123", // mock token
      };

      // Save user data to localStorage (like in login)
      localStorage.setItem("user", JSON.stringify(newUser));

      setMessage("Signup successful!");
      setIsRedirecting(true);

      // Redirect after short delay
      setTimeout(() => {
        if (role === "producer") navigate("/producer-dashboard");
        else if (role === "consumer") navigate("/consumer-dashboard");
        else if (role === "admin") navigate("/admin-dashboard");
      }, 1500);
    } else {
      setMessage("Please fill all fields!");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
      <Typography variant="h5">Sign Up</Typography>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value="consumer">Consumer</MenuItem>
              <MenuItem value="producer">Producer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" type="submit">
            Sign Up
          </Button>
          {message && (
            <Typography
              color={
                message.includes("successful") ? "success.main" : "error.main"
              }
            >
              {message}
            </Typography>
          )}

          {isRedirecting && (
            <Box display="flex" justifyContent="center" mt={1}>
              <CircularProgress size={24} />
              <Typography variant="body2" ml={1}>
                Redirecting...
              </Typography>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
}
