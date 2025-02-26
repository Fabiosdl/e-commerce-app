import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SuccessfulPayment = () => {
  const navigate = useNavigate();

  // Redirect the user to the customer dashboard after a 4 sec delay
  useEffect(() => {
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 4000);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Payment Successful!</h2>
      <p>Your payment has been processed successfully. You will be redirected to your dashboard shortly.</p>
      <p>Thank you for your purchase!</p>

    </div>
  );
};

export default SuccessfulPayment;
