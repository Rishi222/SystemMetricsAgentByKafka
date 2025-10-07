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
import { API_URL } from "../utils/api";

export default function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // here we get the role from the login frontend
  const roleFromURL =
    new URLSearchParams(location.search).get("role") || "producer";

  // we set roles here
  const [role, setRole] = useState(roleFromURL);
  // we set message here 
  const [message, setMessage] = useState("");
  // we move to other page
  const [isRedirecting, setIsRedirecting] = useState(false);

  // here al first the value or main field are nill
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // here i handle the submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // if any of thing is not present
    if (!formData.username || !formData.email || !formData.password) {
      setMessage("Please fill all fields!");
      return;
    }

    try {
      // connect to the backend api
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // add the missing role 
        body: JSON.stringify({ ...formData ,role}),
        credentials: "include",
      });

      const data = await response.json();
      
      // if the response is ok so it check for multiple condition's
      if (response.ok) {
        // store in localstorage for page process 
        localStorage.setItem("user", JSON.stringify(data.user));

        // show message to frontend
        setMessage("Signup successful!");
        setIsRedirecting(true);
        
        // here we move to the perticular dashboard
        setTimeout(() => {
          if (data.user.role === "producer") navigate("/producer-dashboard");
          else if (data.user.role === "consumer")
            navigate("/consumer-dashboard");
          else if (data.user.role === "admin") navigate("/admin-dashboard");
        }, 1500);
      } else {
        setMessage(data.message || "Signup failed!");
      }
    } catch (error) {     
      console.error(error);
      setMessage("Server error. Try again later.");
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
