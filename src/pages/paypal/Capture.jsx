import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const Capture = () => {

    const userId = Number(localStorage.getItem('userId'));
    const orderId = Number(localStorage.getItem('entityOrderId'));
    const navigate = useNavigate();

    // First Extract token from the URL
    // send a request to capture the order
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");

        if (tokenFromUrl) {
            api.post(`/user/${userId}/order/${orderId})}/payments/capture`, null, {
                params: { token: tokenFromUrl }
            })
            .then(response => {
                console.log("Order captured successfully:", response.data);
                navigate('/successful-payment');
            })
            .catch(error => {
                console.error("Error capturing order:", error);
                navigate('/payment-failed');
            });
        } else {
            console.error("Missing token in the URL");
        }
    }, []);
}


export default Capture;