import { Routes, Route } from 'react-router-dom';
import React, {useEffect} from 'react';
import api from './api';
import Login from './pages/Login';
import Hello from './pages/Hello';
import CustomerDashboard from './pages/CustomerDashboard';
import SignUp from './pages/signup/Register';
import SuccessfulSignUp from './pages/signup/successfulSignUp';

const App = () => {
  //loggin purposes
  // useEffect(() => {
  //   // Initial request to set CSRF token in cookies
  //   api.get("/api/auth/csrf")
  //     .then(() => console.log("✅ CSRF Token fetched"))
  //     .catch((error) => console.error("❌ Error fetching CSRF Token:", error));
  // }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />  {/* Default route for home */}
        <Route path="/login" element={<Login />} />
        <Route path="/hello" element={<Hello />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/successful-signup" element={<SuccessfulSignUp />} />
      </Routes>
    </>
  );
};

export default App;
