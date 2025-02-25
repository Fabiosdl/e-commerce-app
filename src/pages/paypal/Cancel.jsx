import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; 

const CancelOrder = () => {
    const [error, setError] = useState(null);

    const userId = Number(localStorage.getItem('userId')) || 0;
    const orderId = Number(localStorage.getItem('entityOrderId')) || 0;

    const navigate = useNavigate();

    const cancelOrder = async () => {

        console.log("function cancel order is being called");
        if(orderId === 0){
            console.error("Order Id cannot be 0");
            setError("Order Id cannot be 0");
            return;  
        }

        try {
            const response = await api.delete(`user/${userId}/order/${orderId}/cancel`);
            if (response.status === 200) {
                console.log("Order successfully cancelled");
            } else {
                console.error("Could not cancel order");
                setError("Failed to cancel order. Please try again.");
            }
        } catch (err) {
            console.error("Error trying to cancel order:", err);
            setError("Error trying to cancel order");
        }
    };

    useEffect(() => {
        cancelOrder(); 


        setTimeout(() => {
            navigate("/dashboard");
        }, 5000);
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Payment Has Been Canceled!</h2>
            <p>You will be redirected to your dashboard shortly.</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default CancelOrder;
