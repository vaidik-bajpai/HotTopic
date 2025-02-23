import { Outlet } from "react-router-dom";

function WrapperResetPassword() {
    return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <Outlet />
        </div>
    )
}

export default WrapperResetPassword