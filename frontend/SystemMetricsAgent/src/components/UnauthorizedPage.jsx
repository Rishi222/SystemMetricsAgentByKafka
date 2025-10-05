import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="error">
        🚫 Unauthorized Access
      </Typography>
      <Typography variant="body1" mt={2}>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </Box>
  );
}