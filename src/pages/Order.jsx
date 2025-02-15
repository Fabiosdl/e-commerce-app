import React, { useState, useEffect } from "react";
import api from "../api";

const Order = () => {

    const [orderId, setOrderId] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = Number(localStorage.getItem('userId'));

    useEffect(() => {

        const fetchOrder = async () => {

            try {
                const response = await api.get(`/user/${userId}/order/pending-order`);
                if (response.data && response.data.items) {
                    const { id, items, totalPrice } = response.data;
    
                    console.log("Order items:", items);   // Prints array structure
                    console.table(items);                // Displays items in tabular form
                    console.log(JSON.stringify(items, null, 2));  // Pretty-print JSON format
    
                    setOrderId(id);
                    setOrderItems(items);
                    setTotalPrice(totalPrice);
                } else {
                    console.warn("No items found in order response");
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setError("Failed to fetch order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();

    },[userId]);   

    const handlePayment = async () => {
        try {

            const orderIdParam = Number(orderId);
            const response = await api.post(`/user/${userId}/order/${orderIdParam}/payments/create`);
            
            if (!response || !response.data) {
                console.error("Payment response is empty");
                return;
            }

            const approvalUrl = response.data.approval_url;
            if (approvalUrl) {
                window.location.href = approvalUrl; // Redirect to PayPal for approval
            } else {
                console.error("Approval URL not found in response");
            }

        } catch (err) {
            console.error("Payment failed:", err);
            setError("Payment failed");
        }
    };

    useEffect(() => {
        const capturePayment = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const payPalOrderId = urlParams.get("orderId"); // Get orderId from URL after PayPal redirect
    
            if (!orderId) return;
    
            try {
                const response = await api.post(`/user/${userId}/order/${orderId}/payments/capture`, { payPalOrderId });
    
                if (response.data.success) {
                    alert("Payment successful!");
                    // Optionally, fetch the latest order data again
                } else {
                    console.error("Payment capture failed:", response.data);
                }
    
            } catch (error) {
                console.error("Error capturing payment:", error);
            }
        };
    
        capturePayment();
    }, []);
    

    
    if (loading) return <div className="spinner">Loading...</div>;

    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
            <h2>Order Summary</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid black" }}>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Rate</th>
                        <th style={styles.th}>Quant</th>
                        <th style={styles.th}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orderItems.length > 0 ? (
                        orderItems.map((item) => (
                            <tr key={item.id} style={styles.tr}>
                                <td style={styles.td}>{item.productName}</td>
                                <td style={styles.td}>${item.price.toFixed(2)}</td>
                                <td style={styles.td}>{item.quantity}</td>
                                <td style={styles.td}>${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>No items found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3 style={{ textAlign: "right", marginTop: "15px" }}>Total: ${totalPrice.toFixed(2)}</h3>

            <button onClick={handlePayment}>Pay Now</button>

        </div>
    );
};

const styles = {
    th: { textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" },
    td: { padding: "8px", borderBottom: "1px solid #ddd" },
    tr: { borderBottom: "1px solid #ddd" }
};

export default Order;