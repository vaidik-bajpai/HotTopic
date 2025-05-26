import { useForm } from "react-hook-form";
import FormHeader from "../FormHeader";
import FormInput from "../FormInput";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { showToast } from "../../utility/toast";

const schema = yup.object({
    email: yup.string().email("invalid email").required("email is required")
})

type FormData = yup.InferType<typeof schema>

export function ForgotPasswordForm() {
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(schema),
    })
    
    async function onSubmit(data: FormData) {
        console.log(data);
        try {
            const response = await axios.post(
                "http://localhost:3000/auth/forgot-password",
                { email: data.email },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log("Forgot password call successful", response.data);
            showToast("Password reset email sent!");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                showToast("Unauthorized. Please login again.", "error");
                navigate("/");
            } else {
                showToast("Failed to send forgot password email.", "error");
                console.error("Forgot password call unsuccessful", err);
            }
        }
    }


    return (
        <div className="w-full max-w-md mx-auto px-1 sm:px-0 font-mono space-y-3">
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-indigo-200 space-y-4 transition-all duration-300 ease-in-out"
            >
            <FormHeader headerText="Forgot Password" />
            
            <FormInput
                labelText="New Password"
                placeholder="Enter your new password"
                error={errors.email?.message}
                {...register("email")}
            />
        
            <div className="mt-6"><SubmitButton buttonText="Reset" isSubmitting={isSubmitting} /></div>
            </form>
        </div>
    )
}