import { Routes, Route, useNavigate } from 'react-router-dom';
import React, {useEffect} from 'react';
import Login from './pages/Login';
import Hello from './pages/Hello';
import CustomerDashboard from './pages/CustomerDashboard';
import SignUp from './pages/signup/Register';
import SuccessfulSignUp from './pages/signup/successfulSignUp';
import Order from './pages/Order';

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
        <Route path="/hello" element={<Hello />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/order" element={<Order />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/successful-signup" element={<SuccessfulSignUp />} />
      </Routes>
    </>
  );
};

export default App;
