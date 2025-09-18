import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/apiService';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const { password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.msg + '. Redirecting to login...');
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. The link may have expired.');
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
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
            placeholder="Confirm New Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="btn">
          Reset Password
        </button>
      </form>
      {message && <p style={{ color: 'lightgreen', marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
      {error && <p style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
