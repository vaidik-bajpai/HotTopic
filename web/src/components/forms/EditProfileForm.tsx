import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormHeader from "../FormHeader";
import FormSubHeader from "../FormSubHeader";
import FormInput from "../FormInput";
import SubmitButton from "../buttons/SubmitButton";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";

const schema = yup.object({
  username: yup.string().min(3).max(30).required("Username is required").matches(/^\S*$/, "Username cannot contain spaces").trim(),
  bio: yup.string().max(200).trim(),
  pronouns: yup.string().max(30).trim(),
}).required();

type FormData = yup.InferType<typeof schema>;

interface UserProfile extends FormData {
  image: string | null;
}

export interface EditProfileFormProps {
    user: UserProfile;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialData, setInitialData] = useState<UserProfile | null>(user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
  console.log("Incoming user to EditProfileForm", user); // ✅ debug
  if (user) {
    reset(user); // resets form fields
    setInitialData(user);
    setImagePreview(user.image);
  }
}, [user, reset]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const onSubmit = async (data: FormData) => {
    if (!initialData) return;

    const updatedFields: Partial<UserProfile> = {};
    const current = {
      username: data.username,
      bio: data.bio,
      pronouns: data.pronouns,
    };

    for (const key of Object.keys(current) as (keyof FormData)[]) {
      if (current[key] !== initialData[key]) {
        updatedFields[key] = current[key];
      }
    }

    if (imageFile) {
      updatedFields.image = imagePreview || null;
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes made.");
      return;
    }

    try {
      await axios.put("http://localhost:3000/user/profile", updatedFields, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      toast.success("Profile updated successfully ✨");
      setInitialData({ ...initialData, ...updatedFields });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
          toast.error("Unauthorized. Please login again.", { position: "top-right" });
          navigate("/");
      } else {
          toast.error("Failed to update profile.", { position: "top-right" });
          console.error("Update error", err);
      }
    }
  };

  if (!initialData) {
    return <div className="text-center text-gray-500 mt-10">Loading profile...</div>;
  }

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-mono space-y-6">
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-indigo-200 space-y-3 transition-all duration-300 ease-in-out"
        >
        <FormHeader headerText="Edit Profile" />
        <FormSubHeader subHeaderText="Update your personal info and preferences" />

        {/* Image Section */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-100 overflow-hidden ring-2 ring-indigo-500 cursor-pointer transition hover:scale-105"
            onClick={triggerFileInput}
          >
            <img
              src={imagePreview || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={triggerFileInput}
            className="text-sm text-indigo-600 hover:underline font-bold"
          >
            Change Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Username */}
        <FormInput
          labelText="Username"
          placeholder="Enter your username"
          error={errors.username?.message}
          {...register("username")}
        />

        {/* Bio */}
        <FormInput
          labelText="Bio"
          placeholder="something about yourself"
          error={errors.pronouns?.message}
          {...register("bio")}
        />

        {/* Pronouns */}
        <FormInput
          labelText="Pronouns"
          placeholder="e.g. she/her, he/him"
          error={errors.pronouns?.message}
          {...register("pronouns")}
        />

        <div className="mt-5">
            <SubmitButton buttonText="Save Changes" isSubmitting={isSubmitting} />
        </div>
        
      </form>
    </div>
  );
}
