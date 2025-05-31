import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { showToast } from "../utility/toast";
import { useEffect } from "react";

const AccountActivation = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    async function handleActivation() {
        const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI
        try {
            await axios.post(   
                `${backendBaseURI}/auth/activate/${token}`,
                {
                    withCredentials: true,
                }
            );
            showToast("Account Activated Successfully!");
            navigate("/")
        } catch (err) {
            showToast("something went, please try again!", "error")
        }
    }

    useEffect(() => {
        handleActivation();
    }, [token])


    return (
        <div className="w-full max-w-md mx-auto px-1 sm:px-0 font-mono space-y-6 text-center mt-10">
            <h1 className="text-2xl font-bold text-indigo-700">Activating your account...</h1>
            <p className="text-gray-500">Please wait, we're verifying your email.</p>
        </div>
    )
}

export default AccountActivation;