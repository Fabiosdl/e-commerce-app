import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SuccessfulPayment = () => {
  const navigate = useNavigate();

  // Redirect the user to the customer dashboard after a short delay
  useEffect(() => {
    // You can add a short delay if you want to display the success message for a while
    setTimeout(() => {
      navigate("/customer-dashboard");
    }, 3000); // Redirects after 3 seconds
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Payment Successful!</h2>
      <p>Your payment has been processed successfully. You will be redirected to your dashboard shortly.</p>
      <p>Thank you for your purchase!</p>
      {/* Optional: Display an image or animation here */}
    </div>
  );
};

export default SuccessfulPayment;
