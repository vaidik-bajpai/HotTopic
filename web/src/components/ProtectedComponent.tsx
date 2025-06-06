import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { showToast } from "../utility/toast";

const ProtectedComponent = () => {
    const user = useSelector((state: RootState) => state.auth);

    if (user.status === 'pending' || user.status === 'idle') {
        return null;
    }   

    if(user.status === "failed" || user.id === "") {
        showToast("Please login again!!", "error")
        return <Navigate to="/" replace />;
    }

    if (!user.activated) {
        showToast("Account not activated. Check your inbox.", "error", 3000)
        return <Navigate to="/resend-activation" replace />;
    }

    return <Outlet />;  
};

export default ProtectedComponent;
