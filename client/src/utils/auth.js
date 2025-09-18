import axios from 'axios';

// Set auth token to axios headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

// Get user from token
export const loadUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Set the auth token
    setAuthToken(token);
    
    // Make request to get user data
    const res = await axios.get('/api/auth/me');
    return res.data;
  } catch (err) {
    console.error('Error loading user', err);
    return null;
  }
};

// Logout user
export const logout = () => {
  // Remove token from localStorage and axios headers
  setAuthToken(null);
  // Redirect to login page
  window.location.href = '/login';
};
