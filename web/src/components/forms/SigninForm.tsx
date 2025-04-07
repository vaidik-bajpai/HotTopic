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
/* import { userAtom } from "../../states/atoms/userAtom"; */

const schema = yup.object({
    email: yup.string().email("invalid email").required("email address is required"),
    password: yup.string().min(8, "password must be atleast 8 characters long.").required("password is required").max(72, "password cannot be more than 72 characters long.")
}).required();

type FormData = yup.InferType<typeof schema>;

export default function Form() {
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userAtom);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    async function onSubmit(data: FormData) {
        try {
            const response = await axios.post("http://localhost:3000/auth/signin", {
                email: data.email,
                password: data.password,
            }, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true
            })

            console.log("Sign in Successful", response.data)
            setUser({isLoggedIn: true, id: response.data.id })
            navigate("/dashboard")
        } catch(err) {  
            console.error("Sign in Failed")
        }
    }
    return (
        <div className="flex flex-col gap-1 font-mono max-w-md"> 
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white flex flex-col gap-3 p-4 border rounded-xl rounded-xl border-blue-500">
                <div className="mx-auto">
                    <FormHeader headerText="Sign in"/>
                </div>
                <div className="mx-auto">
                    <FormSubHeader subHeaderText="Welcome back! Let's pick up the conversation." />
                </div>
                <FormInput labelText="Email" placeholder="Enter your email" error={errors.email?.message} {...register("email")}/>
                <PasswordInput labelText="Password" placeholder="Enter your password" error={errors.password?.message} {...register("password")}/>
                <button
                    className="mr-auto px-2 text-sm font-semibold text-blue-600 cursor-pointer"
                    onClick={() => navigate("/forgot-password")}>Forgot Password ?</button>
                <div className="mt-2">
                    <SubmitButton buttonText="Hop In" isSubmitting={isSubmitting}/>
                </div>
                <div className="text-sm m-auto">Don't have an account? <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => navigate("/signup")}>Sign up</span></div>
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
