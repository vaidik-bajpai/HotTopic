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
import { useSetRecoilState } from "recoil";
import { userAtom } from "../../state/atoms/userAtom";

const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8).max(72).required("Password is required")
}).required();

type FormData = yup.InferType<typeof schema>;

export default function SigninForm() {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userAtom);

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
            setUser({ isLoggedIn: true, id: response.data.id });
            navigate("/dashboard");
        } catch (err) {
            console.error("Sign in failed");
        }
    }

    return (
        <div className="w-full max-w-md font-mono space-y-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-2xl shadow-lg border border-blue-300 space-y-4"
            >
                <FormHeader headerText="Sign in" />
                <FormSubHeader subHeaderText="Welcome back! Let’s pick up the conversation." />

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

                <div className="text-right">
                    <button
                        type="button"
                        className="text-sm font-semibold text-blue-600 hover:underline"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </div>

                <SubmitButton buttonText="Hop In" isSubmitting={isSubmitting} />

                <div className="text-sm text-center">
                    Don’t have an account?{" "}
                    <span
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate("/signup")}
                    >
                        Sign up
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
