import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelectPage from "./pages/RoleSelectPage";
import LoginPage from "./pages/LoginPage"
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelectPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
