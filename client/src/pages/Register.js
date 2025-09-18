import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiService";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", { username, email, password });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err.response.data);
      const errorMessage = err.response?.data?.msg || "Error registering user.";
      alert(errorMessage);
    }
  };

  return (
    // Apply the main form container style
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        {/* Apply form group style to each input container */}
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
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        {/* Apply the button style */}
        <button type="submit" className="btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
