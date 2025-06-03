import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormHeader from "../FormHeader";
import FormSubHeader from "../FormSubHeader";
import FormInput from "../FormInput";
import SubmitButton from "../buttons/SubmitButton";
import axios from "axios";
import { useNavigate } from "react-router";
import { showToast } from "../../utility/toast";
import defaultAvatar from "../../assets/Default-Profile.png";

const schema = yup.object({
  username: yup
    .string()
    .min(3, "Too short")
    .max(30, "Too long")
    .required("Required")
    .matches(/^\S*$/, "No spaces")
    .trim(),

  bio: yup.string().max(200, "Max 200 chars").trim(),

  pronouns: yup
    .string()
    .trim()
    .matches(
      /^([a-zA-Z]+\/)*[a-zA-Z]+$/,
      "Use format: he/him"
    )
    .test(
      "valid-pronouns",
      "Letters only, no empty parts",
      (value) => {
        if (!value) return true;
        return value.split("/").every((p) => /^[a-zA-Z]+$/.test(p));
      }
    ),
});

type FormData = yup.InferType<typeof schema>;

interface UserProfile extends FormData {
  user_id: string
  userpic: string | null;
}

export interface EditProfileFormProps {
  user: UserProfile;
  setIsEditProfile: (val: boolean) => void;
}

export default function EditProfileForm({ user, setIsEditProfile }: EditProfileFormProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialData, setInitialData] = useState<UserProfile | null>(user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.userpic);

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
      reset(user);
      setInitialData(user);
      setImagePreview(user.userpic);
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

    const pronounsArray = data.pronouns?.trim().split("/") ?? [];

    const current = {
      username: data.username,
      bio: data.bio,
      pronouns: pronounsArray,
    };

    const updatedFields: Partial<Omit<UserProfile, "pronouns">> & {
      pronouns?: string[];
    } = {};

    for (const key of Object.keys(current) as (keyof typeof current)[]) {
      if (key === "pronouns") {
        const originalPronounsArray = initialData.pronouns?.split("/") ?? [];
        if (JSON.stringify(pronounsArray) !== JSON.stringify(originalPronounsArray)) {
          updatedFields.pronouns = pronounsArray;
        }
      } else if (current[key] !== initialData[key]) {
        updatedFields[key] = current[key];
      }
    }

    try {
      if (imageFile) {
        const env = import.meta.env
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", env.VITE_CLOUD_PRESET);
        formData.append("cloud_name", env.VITE_CLOUD_NAME);
        const cloudinaryRes = await axios.post(
          import.meta.env.VITE_CLOUDINARY_UPLOAD_URI,
          formData
        );
        const imageUrl = cloudinaryRes.data.secure_url;
        updatedFields.userpic = imageUrl;
      }

      if (Object.keys(updatedFields).length === 0) {
        showToast("No changes made.", "info");
        return;
      }

      const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI
      await axios.put(`${backendBaseURI}/user/profile`, updatedFields, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      showToast("Profile updated successfully ✨");

      const updatedFieldsToSet: Partial<UserProfile> = {
        ...updatedFields,
        pronouns: updatedFields.pronouns?.join("/"),
      };

      setInitialData({ ...initialData, ...updatedFieldsToSet });
      setIsEditProfile(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if(err.response?.status === 401) {
          showToast("Unauthorized. Please login again.", "error");
          navigate("/");
        }
        else if (err.response?.status === 409) {
          showToast("username already in use", "error");
          return
        }
      } else {
        showToast("Failed to update profile.", "error");
        console.error("Update error", err);
      }
    }
  };

  if (!initialData) {
    return <div className="text-center text-gray-500 mt-10">Loading profile...</div>;
  }

  return (
    <div className="z-50 w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-mono space-y-6">
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
              src={imagePreview || defaultAvatar}
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
            multiple={false}
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
          error={errors.bio?.message}
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
