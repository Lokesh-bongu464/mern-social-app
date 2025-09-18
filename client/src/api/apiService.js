import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: '/api', // The proxy will handle redirecting this to http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set or remove the authentication token
export const setAuthToken = (token) => {
  if (token) {
    // Apply the authorization token to every request if logged in
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    // Delete the auth header
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize auth token from localStorage if it exists
const savedToken = localStorage.getItem('token');
if (savedToken) {
  setAuthToken(savedToken);
}

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear auth state if token is invalid/expired
      setAuthToken(null);
      // Redirect to login if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
