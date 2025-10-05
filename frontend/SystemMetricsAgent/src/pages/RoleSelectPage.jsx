import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

export default function RoleSelectPage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Login submitted successfully!");
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h5">Choose Role ?</Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
            <Button
              onClick={() => navigate("/login?role=producer")}
              variant="contained"
            >
              Producer
            </Button>
            <Button
              onClick={() => navigate("/login?role=consumer")}
              variant="contained"
            >
              Consumer
            </Button>
            <Button
              onClick={() => navigate("/login?role=admin")}
              variant="contained"
            >
              Admin
            </Button>
          </Box>
        </form>
        {message && 
          (<Typography variant="body1" color="green" mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </>
  );
}