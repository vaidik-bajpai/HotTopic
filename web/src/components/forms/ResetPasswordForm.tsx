import { useForm } from "react-hook-form";
import FormHeader from "../FormHeader";
import FormSubHeader from "../FormSubHeader";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router";
import axios from "axios";
import PasswordInput from "../PasswordInput";

const schema = yup.object({
    new_password: yup
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(72, "Password cannot be more than 72 characters long.")
        .required("Password is required"),
        
    confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password")], "Passwords must match")
        .required("Confirm password is required"),
}).required();

type FormData = yup.InferType<typeof schema>

function ResetPasswordForm() {
    let { token } = useParams() 
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm({
        resolver: yupResolver(schema),
    })

    async function onSubmit(data: FormData) {
        console.log(JSON.stringify(data))
        try {
            const response = await axios.post(`http://localhost:3000/auth/reset-password/${token}`, {
                new_password: data.new_password,
                confirm_password: data.confirm_password,
            }, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            console.log("reset password successful", response.data)
        } catch(err) {
            console.error("Failed to reset password")
        }
    }
    return (
        <div className="flex flex-col gap-1 font-mono"> 
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3 p-4 border rounded-xl rounded-xl border-blue-500 max-w-md"
            >
                <div className="mx-auto">
                    <FormHeader headerText="Reset Password"/>
                </div>
                <div className="mx-auto text-center">
                    <FormSubHeader subHeaderText="" />
                </div>
                <PasswordInput labelText="New Password" placeholder="Enter your new password" error={errors.new_password?.message} {...register("new_password")}/>
                <PasswordInput labelText="Confirm Password" placeholder="Confirm your new password" error={errors.confirm_password?.message} {...register("confirm_password")}/>
                <div className="mt-2">
                    <SubmitButton buttonText="Reset" isSubmitting={isSubmitting}/>
                </div>
            </form>
        </div>
    )
}

export default ResetPasswordForm;