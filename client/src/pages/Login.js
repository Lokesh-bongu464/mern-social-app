import React, { useState } from "react";
import { Link } from "react-router-dom";
import api, { setAuthToken } from "../api/apiService";
import { jwtDecode } from "jwt-decode";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token } = res.data;

      sessionStorage.setItem("token", token);
      setAuthToken(token);

      const decoded = jwtDecode(token); // <-- CORRECTED FUNCTION CALL
      setUser({ id: decoded.user.id });

      alert("Login successful!");
      window.location.href = "/";
    } catch (err) {
      console.error(err.response.data);
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem' }}>
          <Link to="/forgot-password" style={{ fontSize: '0.9em', color: '#abb2bf' }}>
            Forgot Password?
          </Link>
        </div>
        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
