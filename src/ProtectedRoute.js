import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect( () => {
        if (!token) {
            // If the user is not logged in, redirect to the login page
            navigate("/login");
        }

    }, [token, navigate]);    

    // If the user is logged in, render the children (protected element)
    return token ? children : null;
};

export default ProtectedRoute;
