import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { API_IP_URI } from "../utils/api";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";


export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setMessage("Please enter a new password.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${API_IP_URI}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, id, newPassword }),
        credentials: "include",
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        const { user, token } = data;

        // ✅ Store token and user info (optional if using cookies)
        localStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userRole", user.role);

        setMessage("Password reset successful! Redirecting...");

        // // ✅ Role-based redirect
        setTimeout(() => {
          navigate(`/login?role=${user.role}`);
        }, 1500);
      } else {
        setMessage(data.message || "Invalid or expired token");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleReset}>
        <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            // startIcon={isSubmitting && <CircularProgress size={16} />}
          >
            {isSubmitting ? "Processing..." : "Reset Password"}
          </Button>

          {message && (
            <Typography
              color={
                message.toLowerCase().includes("success")
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
                Please wait...
              </Typography>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
}
