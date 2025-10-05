import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// authentecation pages
import RoleSelectPage from "./pages/RoleSelectPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./components/UnauthorizedPage";
// navbar page
// import Navbar from "./components/Navbar";
// about page
import AboutPage from "./pages/AboutPage";
// Dashboards
import ProducerDashboard from "./pages/dashboards/ProducerDashboard";
import ConsumerDashboard from "./pages/dashboards/ConsumerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
// Auth protection
import AuthCheck from "./components/AuthCheck";

// CSS file.
import "./App.css";


function App() {
  return (
    <>
      <Router>
        {/* Navbar will always show at the top */}
        {/* <Navbar /> */}

        {/* Main page content changes based on route */}
        <Routes>
          <Route path="/" element={<RoleSelectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected routes by role */}
          <Route
            path="/producer-dashboard"
            element={
              <AuthCheck allowedRoles={["producer"]}>
                <ProducerDashboard />
              </AuthCheck>
            }
          />
          <Route
            path="/consumer-dashboard"
            element={
              <AuthCheck allowedRoles={["consumer"]}>
                <ConsumerDashboard />
              </AuthCheck>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <AuthCheck allowedRoles={["admin"]}>
                <AdminDashboard />
              </AuthCheck>
            }
          />

          {/* Utility routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
