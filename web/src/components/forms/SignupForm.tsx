import { useNavigate } from "react-router";
import ContinueWithGoogle from "../buttons/ContinueWithGoogle";
import FormHeader from "../FormHeader";
import FormInput from "../FormInput";
import FormSubHeader from "../FormSubHeader";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from 'yup'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import PasswordInput from "../PasswordInput";

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
        formState: { errors, isSubmitting }
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    async function onSubmit(data: FormData) {
        try {
            const response = await axios.post("http://localhost:3000/auth/signup", data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log("Signup successful", response.data);
            navigate("/signin");
        } catch (err: any) {
            console.error("Signup failed:", err.response?.data || err.message);
        }
    }

    return (
        <div className="w-full max-w-100 font-mono space-y-3">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-2xl shadow-lg border border-blue-300 space-y-4"
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
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate("/")}
                    >
                        Sign in
                    </span>
                </div>
            </form>

            <div className="flex items-center justify-center gap-2">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="text-gray-500">Or</span>
                <hr className="flex-grow border-t border-gray-300" />
            </div>

            <ContinueWithGoogle />
        </div>
    );
}
