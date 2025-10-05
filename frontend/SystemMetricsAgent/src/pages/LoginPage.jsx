import { Link, useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function Login() {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Login submitted successfully!");
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h5">Login {role && `as ${role}`}</Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
            {/* <TextField label=" Username" required /> */}
            <TextField label="Email or Username" required />
            <TextField label="Password" type="password" required />
            <Button variant="contained" type="submit">
              Login
            </Button>
            {message && <Typography color="success.main">{message}</Typography>}
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
