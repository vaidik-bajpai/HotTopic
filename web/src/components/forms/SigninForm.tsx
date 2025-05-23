import { useNavigate } from "react-router";
import FormHeader from "../FormHeader";
import FormInput from "../FormInput";
import FormSubHeader from "../FormSubHeader";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import PasswordInput from "../PasswordInput";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8).max(72).required("Password is required")
}).required();

type FormData = yup.InferType<typeof schema>;

export default function SigninForm() {
    const navigate = useNavigate();
    const user = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    async function onSubmit(data: FormData) {
        try {
            const response = await axios.post("http://localhost:3000/auth/signin", data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            user.setUser({ isLoggedIn: true, id: response.data.id });
            toast.success("Welcome back! 🎉");
            navigate("/dashboard");
        } catch (error) {
            const err = error as AxiosError;

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        toast.error("Invalid request. Please try again.");
                        break;
                    case 422:
                        toast.error("Validation error. Please check your input.");
                        break;
                    case 401:
                        toast.error("Invalid email or password.");  
                        break;
                    case 500:
                        toast.error("Something went wrong. Please try later.");
                        break;
                    default:
                        toast.error(`Unexpected error: ${err.response.status}`);
                        break;
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }

            console.error("Sign in failed", err);
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
