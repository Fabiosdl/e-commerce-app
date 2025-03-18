import {Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import React, {useEffect} from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/signup/Login';
import SignUp from './pages/signup/Register';
import SuccessfulSignUp from './pages/signup/successfulSignUp';
import Dashboard from './pages/Dashboard';
import Order from './pages/Order';
import Capture from './pages/paypal/Capture';
import SuccessfulPayment from './pages/paypal/SuccessfulPayment';
import Cancel from './pages/paypal/Cancel';

const App = () => {
  
  const navigate = useNavigate();
  
  //Send the user back to login if jwt token has expired
  useEffect(() => {

    const expiration = localStorage.getItem("tokenExpiration");

    // Auto logout after expiration
    if (expiration && Date.now() < parseInt(expiration)) {
        const timeLeft = parseInt(expiration) - Date.now();
        setTimeout(() => {
            console.warn("Token expired. Logging out...");
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiration");
            navigate("/login");
        }, timeLeft);
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/successful-signup" element={<SuccessfulSignUp />} />
        <Route path="" element={<ProtectedRoute></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />        
        <Route path="/capture" element={<ProtectedRoute><Capture /></ProtectedRoute>} />
        <Route path="/successful-payment" element={<ProtectedRoute><SuccessfulPayment /></ProtectedRoute>} />
        <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;