import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // <-- CORRECTED IMPORT
import { setAuthToken } from "./api/apiService";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";

const token = sessionStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

const Navbar = ({ user, onLogout }) => (
  <nav className="navbar">
    <Link to="/">
      <h1>SocialApp</h1>
    </Link>
    <div className="nav-links">
      <Link to="/">Home Feed</Link>
      {user ? (
        <>
          <button onClick={onLogout} className="btn-logout">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  </nav>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token); // <-- CORRECTED FUNCTION CALL
      setUser({ id: decodedToken.user.id });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Feed user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
