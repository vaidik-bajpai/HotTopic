import { useNavigate } from "react-router-dom";
import FormHeader from "../FormHeader";
import FormInput from "../FormInput";
import FormSubHeader from "../FormSubHeader";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import PasswordInput from "../PasswordInput";
import { showToast } from "../../utility/toast";
import { useDispatch } from "react-redux";
import { addAuthState } from "../../features/auth/authSlice";

const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8).max(72).required("Password is required")
}).required();

type FormData = yup.InferType<typeof schema>;

export default function SigninForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    async function onSubmit(data: FormData) {
        const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI
        try {
            const response = await axios.post(`${backendBaseURI}/auth/signin`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            dispatch(addAuthState({
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                status: "succeeded",
                activated: response.data.activated,
            }))

            if(response.data.activated) showToast("Welcome back! 🎉");
            reset();
            navigate("/feed");
        } catch (error) {
            const err = error as AxiosError;

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        showToast("Invalid request. Please try again.", "error");
                        break;
                    case 422:
                        showToast("Validation error. Please check your input.", "error");
                        break;
                    case 401:
                        showToast("Invalid email or password.", "error");  
                        break;
                    case 500:
                        showToast("Something went wrong. Please try later.", "error");
                        break;
                    default:
                        showToast(`Unexpected error: ${err.response.status}`, "error");
                        break;
                }
            } else {
                showToast("Network error. Please check your connection.", "error");
            }
        }
    }

    return (
        <div className="w-full max-w-md md:max-w-lg mx-auto px-1 sm:px-0 font-mono space-y-3">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-indigo-200 space-y-4 transition-all duration-300 ease-in-out"
            >
                <FormHeader headerText="Sign in" />
                <FormSubHeader subHeaderText="Welcome back! Let’s pick up the conversation."/>

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

                <div className="text-left px-1">
                    <button
                        type="button"
                        className="cursor-pointer text-sm font-semibold text-indigo-600 hover:underline transition-all"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </div>

                <SubmitButton buttonText="Hop In" isSubmitting={isSubmitting} />

                <div className="text-sm text-center text-gray-700">
                    Don’t have an account?{" "}
                    <span
                        className="text-indigo-600 font-semibold cursor-pointer hover:underline transition-all"
                        onClick={() => navigate("/signup")}
                    >
                        Sign up
                    </span>
                </div>
            </form>
        </div>
    );
}
