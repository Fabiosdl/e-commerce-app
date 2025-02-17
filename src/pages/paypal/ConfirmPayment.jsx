import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const ConfirmPayment = () => {
    const userId = Number(localStorage.getItem('userId'));
    const entityOrderId = Number(localStorage.getItem('entityOrderId'));
    const token = localStorage.getItem('paypalToken');

    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token || !entityOrderId) return;  // Skip fetching if missing critical params.

            try {
                const response = await api.get(`/user/${userId}/order/pending-order`);
                if (response.data && response.data.items) {
                    const { items, totalPrice } = response.data;
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
    }, []); // Run only once when the component mounts

    const handleConfirmPayment = async () => {
        try {
            const orderIdParam = Number(entityOrderId);
            console.log(`paypal token: ${token}`);
            const response = await api.post(`/user/${userId}/order/${orderIdParam}/payments/capture?token=${token}`);

            if (!response || !response.data) {
                console.error("Payment response is empty");
                return;
            }

            navigate("/successful-payment"); // Redirect to successful payment page
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

            <button onClick={handleConfirmPayment}>Confirm Payment</button>
        </div>
    );
};

const styles = {
    th: { textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" },
    td: { padding: "8px", borderBottom: "1px solid #ddd" },
    tr: { borderBottom: "1px solid #ddd" },
};

export default ConfirmPayment;
