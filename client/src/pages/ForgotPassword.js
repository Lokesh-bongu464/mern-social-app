import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/apiService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      // Display the success message from the API
      setMessage(res.data.msg);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <p style={{ marginBottom: '1rem', fontSize: '0.9em', color: '#abb2bf' }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">
          Send Reset Link
        </button>
      </form>
      {message && <p style={{ color: 'lightgreen', marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
      {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
