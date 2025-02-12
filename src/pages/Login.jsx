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

    // format for basic authorization
    const credentials = `${username}:${password}`;

    //encode the credentials to Base64
    const encodedCredentials = btoa(credentials);
    localStorage.setItem('credentials', encodedCredentials);

    try {

      // Make the POST request using Axios
      
      const response = await api.post('/api/auth/login');

      // Access parsed JSON data from response.data
      const { role, userId, basketId } = response.data;      

      // Store user details 
      localStorage.setItem('userId', userId);
      localStorage.setItem('basketId', basketId);
      console.log('User ID: ', userId);
      console.log('Basket Id: ', basketId);
      console.log('Role: ', role);

      // Redirect based on role
      if (role === 'ROLE_CUSTOMER') {
        navigate('/hello');
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