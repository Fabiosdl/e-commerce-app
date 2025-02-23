import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; 

const CancelOrder = () => {
    const [error, setError] = useState(null);

    const userId = Number(localStorage.getItem('userId')) || 0;
    const orderId = Number(localStorage.getItem('entityOrderId')) || 0;

    const navigate = useNavigate();

    const cancelOrder = async () => {
        try {
            const response = await api.delete(`user/${userId}/order/${orderId}/cancel`);
            if (response.status !== 200 && response.status !== 204) {
                console.error("Could not cancel order");
                setError("Failed to cancel order. Please try again.");
            }
        } catch (error) {
            console.error("Error trying to cancel order:", error);
            setError("Error trying to cancel order");
        }
    };

    useEffect(() => {
        const cancelAndRedirect = async () => {
            await cancelOrder();
            setTimeout(() => {
                navigate("/dashboard");
            }, 5000);
        };

        cancelAndRedirect();
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Payment Has Been Canceled!</h2>
            <p>You will be redirected to your dashboard shortly.</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default CancelOrder;