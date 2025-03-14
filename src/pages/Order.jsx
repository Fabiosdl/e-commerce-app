import React, { useState, useEffect } from "react";
import api from "../api";

const Order = () => {

    const [entityOrderId, setEntityOrderId] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [basketId, setBasketId] = useState(null);

    const userId = localStorage.getItem('userId');

    const fetchActiveBasket = async () => {
        try {
          const response = await api.get(`/user/${userId}/basket/active-basket`);
          if (response.data) setBasketId(response.data.id);
        } catch (err) {
          console.error("Error fetching active basket", err);
        }
    };

    useEffect(() => {

        fetchActiveBasket(); //fetch basket and set basket id as soon the page loads
        //or the user changes.

    },[userId])

    useEffect(() => {

        const fetchOrder = async () => {

            try {
                const response = await api.get(`/user/${userId}/order/newest-created-order`);
                if (response.data && response.data.items) {
                    const { id, items, totalPrice } = response.data;
    
                    console.table(items);                // Displays items in tabular form
    
                    setEntityOrderId(id);
                    setOrderItems(items);
                    setTotalPrice(totalPrice);

                    localStorage.setItem('entityOrderId', entityOrderId);

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

    },[entityOrderId]);   

    const handlePayment = async () => {
        try {
            // First, check out the basket
            const checkoutResponse = await api.patch(`/user/${userId}/basket/${basketId}/checkout`);
    
            if (!checkoutResponse || (checkoutResponse.status !== 200 && checkoutResponse.status !== 204)) {
                console.error("Basket could not be checked out");
                setError("Basket checkout failed. Please try again.");
                return; // Ensure we stop execution
            }
    
        } catch (err) {
            console.error("Payment failed. Could not check out basket", err);
            setError("Payment failed. Could not check out basket");
            return; // Stop execution if checkout fails
        }
    
        try {
            const orderIdParam = Number(entityOrderId);
            const paymentResponse = await api.post(`/user/${userId}/order/${orderIdParam}/payments/create`);
    
            if (!paymentResponse || !paymentResponse.data) {
                console.error("Payment response is empty");
                setError("Payment failed. No payment data received.");
                return;
            }
    
            const approvalUrl = paymentResponse.data;
    
            if (approvalUrl && approvalUrl.startsWith("https")) {
                window.location.href = approvalUrl; // Redirect to PayPal
            } else {
                console.error("Invalid PayPal approval URL:", approvalUrl);
                setError("Invalid PayPal approval URL");
            }
    
        } catch (err) {
            console.error("Payment failed:", err);
            setError("Payment failed");
        }
    };
    
    
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