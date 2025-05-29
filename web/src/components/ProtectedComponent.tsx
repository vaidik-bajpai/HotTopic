import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";

const ProtectedComponent = () => {
    const user = useSelector((state: RootState) => state.auth);

    if (user.status === 'failed') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;  
};

export default ProtectedComponent;
