import { useForm } from "react-hook-form";
import FormHeader from "./FormHeader";
import FormInput from "./FormInput";
import FormSubHeader from "./FormSubHeader";
import SubmitButton from "./SubmitButton";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const schema = yup.object({
    email: yup.string().email("invalid email").required("email is required")
})

type FormData = yup.InferType<typeof schema>

export function ForgotPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: yupResolver(schema),
    })

    async function onSubmit(data: FormData) {
        console.log(data)
        try {
            const response = await axios.post("http://localhost:3000/auth/forgot-password", {
                email: data.email,
            }, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            console.log("Forgot password call successful", response.data)
        } catch(err) {
            console.error("Forgot password call unsuccessful")
        }
    }

    return (
        <div className="flex flex-col gap-1 font-mono"> 
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3 p-4 border rounded-xl rounded-xl border-blue-500 max-w-md"
            >
                <div className="mx-auto">
                    <FormHeader headerText="Forgot Password!"/>
                </div>
                <div className="mx-auto text-center">
                    <FormSubHeader subHeaderText="Forgot your password? Enter your email, and we'll send you a reset link." />
                </div>
                <FormInput labelText="Email" placeholder="Enter your email" error={errors.email?.message} {...register("email")}/>
                <div className="mt-2">
                    <SubmitButton buttonText="Send Link" isSubmitting={isSubmitting}/>
                </div>
            </form>
        </div>
    )
}