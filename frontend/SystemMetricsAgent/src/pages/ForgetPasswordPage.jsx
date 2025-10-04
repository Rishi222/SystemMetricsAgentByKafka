// import { Box, TextField, Button, Typography } from "@mui/material";
// import { useState } from "react";

// export default function ForgetPasswordPage() {
//   const [message, setMessage] = useState("");

//   const handleForget = (e) => {
//     e.preventDefault();
//     // Process forget password, set message
//     setMessage("Reset link has been sent to your email.");
//   };

//   return (
//     <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
//       <Typography variant="h5">Forgot Password</Typography>
//       <form onSubmit={handleForget}>
//         <Box display="flex" flexDirection="column" gap={2} width={300} mt={2}>
//           <TextField label="Email" required />
//           <Button variant="contained" type="submit">
//             Submit
//           </Button>
//           {message && <Typography color="success.main">{message}</Typography>}
//         </Box>
//       </form>
//     </Box>
//   );
// }
