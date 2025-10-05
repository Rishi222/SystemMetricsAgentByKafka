import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";

export default function SignupPage() {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic and set message accordingly
    setMessage("Signup successful!");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
      <Typography variant="h5">Sign Up</Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
          <TextField label="Username" required />
          <TextField label="Email" type="email" required />
          <TextField label="Password" type="password" required />
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
          {message && <Typography color="success.main">{message}</Typography>}
        </Box>
      </form>
    </Box>
  );
}
