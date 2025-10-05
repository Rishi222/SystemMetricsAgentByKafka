import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// authentecation pages
import RoleSelectPage from "./pages/RoleSelectPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage"
// navbar page
import Navbar from "./components/Navbar";
// about page
import AboutPage from "./pages/AboutPage";

import "./App.css";


function App() {
  return (
    <>
      <Router>
        {/* Navbar will always show at the top */}
        <Navbar />

        {/* Main page content changes based on route */}
        <Routes>
          <Route path="/" element={<RoleSelectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/about" element={<AboutPage/>}/>

          {/* Catch all unmatched routes */}
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
