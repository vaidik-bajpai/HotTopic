import { Outlet, useNavigate, useParams } from "react-router";
import EditProfileButton from "./buttons/EditProfileButton";
import UserBio from "./UserBio";
import UserProfileMetadata from "./UserProfileMetadata";
import UserProfileName from "./UserProfileName";
import UserProfilePic from "./UserProfilePic";
import UserProfileSlider from "./UserProfileSlider";
import { useEffect, useState } from "react";
import axios from "axios";
import EditProfileForm from "./forms/EditProfileForm";

interface UserProfileInterface {
    user_id: string
    username: string
    userpic: string
    bio: string
    pronouns: string[]
    post_count: number
    followers_count: number
    following_count: number
}
function UserProfile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<UserProfileInterface>({
        user_id: "",
        username: "",
        userpic: "",
        bio: "",
        pronouns: [""],
        post_count: 0,
        followers_count: 0,
        following_count: 0,
    })
    
    const { userID } = useParams()

    async function getProfile() {
        const response = await axios.get(`http://localhost:3000/user/profile/${userID}`, {
            withCredentials: true
        })
        setProfile(response.data.profile)
    }

    useEffect(() => {
        getProfile()
    }, [userID])


    return (
        <div className="min-h-screen w-full flex flex-col">
            <div className="bg-white shadow-md rounded-xl flex flex-col flex-grow">
                {/* <UserProfileHeader username="vaidik_bajpai"/> */}
                <div className="flex flex-col flex-grow">
                    <div className="w-full px-4 border-b-2 shadow-none border-b border-gray-200">
                        <div className="flex flex-col max-w-6xl mx-auto justify-center rounded-lg gap-1 p-2 md:p-4">
                            <div className="flex gap-3 sm:gap-4 md:gap-8">
                                <UserProfilePic profilePic={profile.userpic}/>
                                <div className="flex flex-col justify-center gap-1 sm:gap-2 2xl:gap-8 2xl:ml-10 2xl:mb-5">
                                    <UserProfileName name={profile.username} pronouns={profile.pronouns}/>
                                    <div className="flex justify-around gap-4 2xl:gap-6">
                                        <UserProfileMetadata metadata="posts" count={profile.post_count}/>
                                        <UserProfileMetadata metadata="followers" count={profile.followers_count}/>
                                        <UserProfileMetadata metadata="following" count={profile.following_count}/>
                                    </div>
                                </div>
                            </div>
                            <UserBio bio={profile.bio} />
                            <EditProfileButton onClick={() => navigate("/edit")}/>
                        </div>
                        <div className="mt-2">
                            <UserProfileSlider />
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}


export default UserProfile;