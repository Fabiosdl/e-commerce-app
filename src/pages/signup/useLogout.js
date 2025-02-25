import { useNavigate } from "react-router-dom"

const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        navigate("/login");
    };
    return logout;
};

export default useLogout;