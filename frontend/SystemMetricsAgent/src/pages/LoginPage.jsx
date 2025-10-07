import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { API_URL } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();

  // here at first the email or password is nill
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  // to set up the message at function work.
  const [message, setMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // this is use to traverse store the current role.
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Simple validation
    if (!formData.emailOrUsername || !formData.password) {
      setMessage("Please fill all fields!");
      return;
    }

    try {
      // data form backend
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // send cookies
      });

      const data = await response.json();

      // here i check for several condition if the responce is ok.
      if (response.ok) {

        // Check if role matches
        if (data.user.role !== role) {
          setMessage(
            `Role mismatch! You tried to login as "${role}"`
          );
          return; // stop here — no redirect or saving
        }

        // Proceed only if role matches
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful!");
        setIsRedirecting(true);

        // here we move throught the dashboard's for the perticular user role.
        setTimeout(() => {
          if (data.user.role === "producer") navigate("/producer-dashboard");
          else if (data.user.role === "consumer")
            navigate("/consumer-dashboard");
          else if (data.user.role === "admin") navigate("/admin-dashboard");
        }, 1000);
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
      console.error(error);
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h5">Login as {role}</Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
            <TextField
              label="Email or Username"
              name="emailOrUsername"
              value={formData.emailOrUsername}
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

            <Button variant="contained" type="submit">
              Login
            </Button>

            {message && (
              <Typography
                color={
                  message.toLowerCase().includes("successful")
                    ? "success.main"
                    : "error.main"
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

        {/* Links below the form */}
        <Box display="flex" gap={2} mt={2}>
          <Typography
            component={Link}
            to={`/signup?role=${role}`}
            sx={{ textDecoration: "none", color: "primary.main" }}
          >
            Signup
          </Typography>
          <Typography
            component={Link}
            to={`/forget-password?role=${role}`}
            sx={{ textDecoration: "none", color: "primary.main" }}
          >
            Forget Password?
          </Typography>
        </Box>
      </Box>
    </>
  );
}
