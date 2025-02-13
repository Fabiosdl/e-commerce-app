import React, { useState } from 'react';
import api from '../api';

import { useNavigate } from 'react-router-dom'; // For redirection after successful login

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const credentials = {
      username : username,
      password : password
    };

    try {

      // Make the POST request using Axios
      
      const response = await api.post('/api/auth/login',credentials);

      // Access parsed JSON data from response.data
      const { token, userId, basketId, role} = response.data;      

      // Store jwt token and user details 
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('basketId', basketId);
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
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;