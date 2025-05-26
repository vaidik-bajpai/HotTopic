import { useForm } from "react-hook-form";
import FormHeader from "../FormHeader";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordInput from "../PasswordInput";
import { showToast } from "../../utility/toast";

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

type FormData = yup.InferType<typeof schema>;

function ResetPasswordForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
        const response = await axios.post(
            `http://localhost:3000/auth/reset-password/${token}`,
            {
                new_password: data.new_password,
                confirm_password: data.confirm_password,
            },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );

        console.log("reset password successful", response.data);
        showToast("Password reset successful!");
        navigate("/");
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            showToast("Unauthorized. Please login again.", "error");
            navigate("/");
        } else {
            showToast("Failed to reset password.", "error");
            console.error("Failed to reset password", err);
        }
    }
  }


  return (
    <div className="w-full max-w-md md:max-w-lg mx-auto px-1 sm:px-0 font-mono space-y-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-indigo-200 space-y-4 transition-all duration-300 ease-in-out"
      >
        <FormHeader headerText="Reset Password" />

        <PasswordInput
          labelText="New Password"
          placeholder="Enter your new password"
          error={errors.new_password?.message}
          {...register("new_password")}
        />

        <PasswordInput
          labelText="Confirm Password"
          placeholder="Confirm your entered password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <SubmitButton buttonText="Reset" isSubmitting={isSubmitting} />
      </form>
    </div>
  );
}

export default ResetPasswordForm;
