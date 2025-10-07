import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

export default function RoleSelectPage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Navigate to login page and pass role in query string
    navigate(`/login?role=${role}`);
    setMessage(`Login submitted successfully as ${role}`);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h5">Choose Role ?</Typography>
          <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
            <Button
              onClick={() => handleRoleSelect("producer")}
              variant="contained"
            >
              Producer
            </Button>
            <Button
              onClick={() => handleRoleSelect("consumer")}
              variant="contained"
            >
              Consumer
            </Button>
            <Button
              onClick={() => handleRoleSelect("admin")}
              variant="contained"
            >
              Admin
            </Button>
          </Box>
        {message && (
          <Typography variant="body1" color="green" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </>
  );
}