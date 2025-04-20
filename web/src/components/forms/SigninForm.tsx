import { useNavigate } from "react-router";
import ContinueWithGoogle from "../buttons/ContinueWithGoogle";
import FormHeader from "../FormHeader";
import FormInput from "../FormInput";
import FormSubHeader from "../FormSubHeader";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import PasswordInput from "../PasswordInput";
import { useUser } from "../../context/UserContext";

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
            navigate("/dashboard");
        } catch (err) {
            console.error("Sign in failed");
        }
    }

    return (
        <div className="w-full max-w-100 font-mono space-y-3">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-3xl shadow-xl border border-indigo-200 space-y-4 transition-all duration-300 ease-in-out"
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

                <div className="text-left">
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

            <div className="flex items-center justify-center gap-2">
                <hr className="flex-grow border-t border-black" />
                <span className="text-black">Or</span>
                <hr className="flex-grow border-t border-black" />
            </div>

            <ContinueWithGoogle />
        </div>
    );
}
