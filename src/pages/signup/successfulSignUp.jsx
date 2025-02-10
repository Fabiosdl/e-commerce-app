import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessfulSignUp = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate("/login"); // Redirect to the login page
    };

    return (
        <div className="success-container">
            <h2>Registration Successful!</h2>
            <p>Your account has been created successfully. Click below to log in.</p>
            <button onClick={handleGoToLogin}>Go to Login</button>
        </div>
    );
};

export default SuccessfulSignUp;
