import { Navigate } from "react-router-dom";

export default function AuthCheck({ allowedRoles, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but wrong role
    return <Navigate to="/unauthorized" replace />;
  }

  // Access granted
  return children;
}
