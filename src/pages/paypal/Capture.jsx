import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Capture = () => {

    const navigate = useNavigate();

    // First useEffect: Extract token and payerId from the URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");
        const payerIdFromUrl = urlParams.get("PayerID");

        if (tokenFromUrl && payerIdFromUrl) {
            localStorage.setItem('paypalToken',tokenFromUrl);
            localStorage.setItem('paypalPayerId',payerIdFromUrl);
            navigate('/successful-payment')

        } else {
            console.error("Missing token or PayerID in the URL");
        }
    }, []);
}

export default Capture;