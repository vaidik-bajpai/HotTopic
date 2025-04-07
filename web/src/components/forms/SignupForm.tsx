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
    username: yup.string().required("username is required"),
    email: yup.string().email("invalid email address").required("email address is required"),
    password: yup.string().min(8, "password must be atleast 8 characters long.").required("password is required").max(72, "password cannot be more than 72 characters long.")
}).required()

type FormData = yup.InferType<typeof schema>;

export default function SignupForm() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm({
        resolver: yupResolver(schema),
    })

    async function onSubmit(data: FormData) {
        try {
            const response = await axios.post("http://localhost:3000/auth/signup", {
                username: data.username,
                email: data.email,
                password: data.password
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            console.log("Sign up successful", response.data)
            navigate("/signin")
        } catch(err: any) {
            console.error("Signup failed:", err.response?.data || err.message)
        }
    }
    
    return ( 
        <div className="flex flex-col gap-1 font-mono w-full max-w-sm p-2"> 
            <form
                onSubmit={handleSubmit(onSubmit)} 
                className="bg-white flex flex-col gap-3 p-4 border rounded-xl rounded-xl border-blue-500">
                <div className="mx-auto">
                    <FormHeader headerText="Sign up"/>
                </div>
                <div className="mx-auto">
                    <FormSubHeader subHeaderText="Join the hottest conversations now!" />
                </div>
                <FormInput labelText="Username" placeholder="Enter your username" error={errors.username?.message} {...register("username")}/>
                <FormInput labelText="Email" placeholder="Enter your email" error={errors.email?.message} {...register("email")}/>
                <PasswordInput labelText="Password" placeholder="Enter your password" error={errors.password?.message} {...register("password")}/>
                <div className="mt-2">
                    <SubmitButton buttonText="Start Trending" isSubmitting={isSubmitting}/>
                </div>
                <div className="text-sm m-auto">Already have an account? <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => navigate("/signin")}>Sign in</span></div>
            </form>
            
            <div className="flex justify-center items-center gap-2 px-2 my-3">
                <div className="border-t-1 w-full h-0 "></div>
                <div>Or</div>
                <div className="border-t-1 w-full h-0 "></div>
            </div>
            <ContinueWithGoogle />
        </div>
    )
}