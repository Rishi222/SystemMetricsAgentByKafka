import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.emailOrUsername || !formData.password) {
      setMessage("Please fill all fields!");
      return;
    }

    // Mock login validation
    if (formData.password === "12345") {
      const loggedInUser = {
        username: formData.emailOrUsername,
        role: role,
        token: "mockToken123",
      };

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setMessage("Login successful!");
      setIsRedirecting(true);

      // Redirect after delay
      setTimeout(() => {
        if (role === "producer") navigate("/producer-dashboard");
        else if (role === "consumer") navigate("/consumer-dashboard");
        else if (role === "admin") navigate("/admin-dashboard");
      }, 1500);
    } else {
      setMessage("Invalid credentials. Try again!");
    }

    // // Simulate successful login
    // const loggedInUser = {
    //   username: "rishi",
    //   role: role, // producer, consumer, or admin (from URL)
    //   token: "mockToken123",
    // };

    // // Save to localStorage
    // localStorage.setItem("user", JSON.stringify(loggedInUser));

    // // set message to user
    // setMessage("Login submitted successfully!");

    // // redirect user based on role
    // setTimeout(() => {
    //   if (role === "producer") navigate("/producer-dashboard");
    //   else if (role === "consumer") navigate("/consumer-dashboard");
    //   else if (role === "admin") navigate("/admin-dashboard");
    // }, 1000);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h5">Login as {role}</Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
            {/* <TextField label=" Username" required /> */}
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
                            message.includes("successful")
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
            {/* {message && <Typography color="success.main">{message}</Typography>} */}

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
            to="/forget-password"
            sx={{ textDecoration: "none", color: "primary.main" }}
          >
            Forget Password?
          </Typography>
        </Box>
      </Box>
    </>
  );
}
