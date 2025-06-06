import { X } from "lucide-react";
import EditProfileForm, { EditProfileFormProps } from "./forms/EditProfileForm";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";

type EditProfilePageProps = EditProfileFormProps & {
    setIsEditProfile: (val: boolean) => void;
};

function EditProfilePage({ user, setIsEditProfile }: EditProfilePageProps) {
    const location = useLocation();

    const [initialLoc, ] = useState<string>(location.pathname);

    useEffect(() => {
        if(initialLoc != location.pathname) {
            setIsEditProfile(false);
        }
    }, [location.pathname]);

    return (
        <div className="absolute inset-0 flex flex-col h-screen bg-indigo-200">
            <div onClick={() => setIsEditProfile(false)}><X className="ml-auto m-2 w-8 h-8 cursor-pointer"/></div>
            <div className="flex-grow flex justify-center items-center">
                <EditProfileForm user={user} setIsEditProfile={setIsEditProfile}/>
            </div>
        </div>
    )
}

export default EditProfilePage;