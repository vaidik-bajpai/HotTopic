import { X } from "lucide-react";
import EditProfileForm, { EditProfileFormProps } from "./forms/EditProfileForm";

type EditProfilePageProps = EditProfileFormProps & {
  setIsEditProfile: (val: boolean) => void;
};

function EditProfilePage({ user, setIsEditProfile }: EditProfilePageProps) {
    return (
        <div className="absolute inset-0 flex flex-col min-h-screen bg-indigo-200">
            <div onClick={() => setIsEditProfile(false)}><X className="ml-auto m-2 w-8 h-8 hidden md:block cursor-pointer"/></div>
            <div className="flex-grow flex justify-center items-center">
                <EditProfileForm user={user}/>
            </div>
        </div>
    )
}

export default EditProfilePage;