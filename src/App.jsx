import { Routes, Route, useNavigate } from 'react-router-dom';
import React, {useEffect} from 'react';
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
        <Route path="/" element={<h1>Home Page</h1>} />  {/* Default route for home */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order" element={<Order />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/successful-signup" element={<SuccessfulSignUp />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/successful-payment" element={<SuccessfulPayment />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </>
  );
};

export default App;