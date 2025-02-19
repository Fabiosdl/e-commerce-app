import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom'; // For redirection after successful login
import './Login.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const credentials = {
      username : username,
      password : password
    };

    try {

      // Make the POST request using Axios

      //Checking if the token is expired. If so, delete it in localStorage
      //Immediately logs out the user if they open the app and the token is already expired.
      // get token expiration
      const expiration = localStorage.getItem('tokenExpiration');
      
      if (expiration && Date.now() > parseInt(expiration)) {
        console.warn("Token expired. Logging out...");
        localStorage.clear();
      }

      const response = await api.post('/api/auth/login',credentials);

      // Access parsed JSON data from response.data
      const { token, expiresIn, userId, role, } = response.data;  
      
      //Set when the token will be expired
      const tokenExpiration = Date.now() + expiresIn;

      // Store jwt token and user details 
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', tokenExpiration);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);

      console.log(`Token sent by the server: ${token}`);
      console.log(`User Id sent by the server: ${userId}`);
      console.log(`User Role sent by the server: ${role}`);

      // Redirect based on role
      if (role === 'ROLE_CUSTOMER') {
        navigate('/customer-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Invalid login credentials');
      } else {
        setErrorMessage('An error occurred while trying to log you in.');
      }
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  

  return (

    <div className="page-container">

      <div className='login-container'>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email"></label>
              <input
                type="email"
                id="username"
                placeholder='Email'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password"></label>
              <input
                type="password"
                id="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="form-actions">

              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <button type="button" className="signup-btn" onClick={() => navigate('/signup')}>
                Sign Up
              </button>

            </div>
            
        </form>
      </div>
    </div>
  );
};

export default LoginPage;