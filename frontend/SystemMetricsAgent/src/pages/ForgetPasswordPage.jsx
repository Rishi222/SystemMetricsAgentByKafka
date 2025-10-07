import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { API_URL } from "../utils/api";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // get the role from the query param (like ?role=producer)
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const handleForget = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email,role }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
      <Typography variant="h5">Forgot Password</Typography>

      <Typography variant="h7">
        Only for {role ? role : "unknown role"}
      </Typography>

      <form onSubmit={handleForget}>
        <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            sx={{ textTransform: "none" }}
          >
            {isSubmitting ? "Processing..." : "Submit"}
          </Button>

          {message && (
            <Typography
              color={
                message.toLowerCase().includes("sent")
                  ? "success.main"
                  : "error.main"
              }
            >
              {message}
            </Typography>
          )}

          {isSubmitting && (
            <Box display="flex" justifyContent="center" mt={1}>
              <CircularProgress size={24} />
              <Typography variant="body2" ml={1}>
                Sending reset link...
              </Typography>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
}
