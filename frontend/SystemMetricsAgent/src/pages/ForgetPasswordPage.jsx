import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForget = (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setMessage("Please enter your email!");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    // Mock password reset logic (you can later replace with real API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("Reset link has been sent to your email.");
    }, 1500);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
      <Typography variant="h5">Forgot Password</Typography>

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
              color={message.includes("sent") ? "success.main" : "error.main"}
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
