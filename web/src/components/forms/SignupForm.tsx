import { useNavigate } from "react-router";
import FormHeader from "../FormHeader";
import FormInput from "../FormInput";
import FormSubHeader from "../FormSubHeader";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import PasswordInput from "../PasswordInput";
import { showToast } from "../../utility/toast";

const schema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8).max(72).required("Password is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function SignupForm() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    async function onSubmit(data: FormData) {
        const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI
        try {
            const response = await axios.post(`${backendBaseURI}/auth/signup`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            showToast("User registered! 🎉")
            reset();
            navigate("/");
        } catch (err: any) {
            console.error("Signup failed:", err.response?.data || err.message);
        }
    }

    return (
        <div className="w-full max-w-lg mx-auto px-1 sm:px-0 font-mono space-y-3">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-indigo-200 space-y-4 transition-all duration-300 ease-in-out"
            >
                <FormHeader headerText="Sign up" />
                <FormSubHeader subHeaderText="Join the hottest conversations now!" />

                <FormInput
                    labelText="Username"
                    placeholder="Enter your username"
                    error={errors.username?.message}
                    {...register("username")}
                />
                <FormInput
                    labelText="Email"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <PasswordInput
                    labelText="Password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <div className="mt-2">
                    <SubmitButton buttonText="Start Trending" isSubmitting={isSubmitting} />
                </div>

                <div className="text-sm text-center">
                    Already have an account?{" "}
                    <span
                        className="text-indigo-600 font-semibold cursor-pointer hover:underline transition-all"
                        onClick={() => navigate("/")}
                    >
                        Sign in
                    </span>
                </div>
            </form>
        </div>
    );
}
