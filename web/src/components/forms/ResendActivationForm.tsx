import { useForm } from "react-hook-form";
import FormHeader from "../FormHeader";
import FormInput from "../FormInput";
import SubmitButton from "../buttons/SubmitButton";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router";
import { showToast } from "../../utility/toast";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type FormData = yup.InferType<typeof schema>;

export function ResendActivationForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data: FormData) {
    const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI;
    try {
      const response = await axios.post(
        `${backendBaseURI}/auth/resend-activation`,
        { email: data.email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      showToast("Activation email sent!");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        showToast("Unauthorized. Please login again.", "error");
        navigate("/signin");
      } else {
        showToast("Failed to resend activation email.", "error");
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-1 sm:px-0 font-mono space-y-3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-indigo-200 space-y-4 transition-all duration-300 ease-in-out"
      >
        <FormHeader headerText="Resend Activation Email" />

        <FormInput
          labelText="Email"
          placeholder="Enter your account email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="mt-6">
          <SubmitButton buttonText="Send Activation" isSubmitting={isSubmitting} />
        </div>
      </form>
    </div>
  );
}
