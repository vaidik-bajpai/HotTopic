import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import EditProfileButton from "./buttons/EditProfileButton";
import UserBio from "./UserBio";
import UserProfileMetadata from "./UserProfileMetadata";
import UserProfileName from "./UserProfileName";
import UserProfilePic from "./UserProfilePic";
import UserProfileSlider from "./UserProfileSlider";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import ProfileFollowButton from "./buttons/ProfileFollowButton";
import ProfileUnFollowButton from "./buttons/ProfileUnfollowButton";
import EditProfilePage from "./EditProfilePage";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import NotAFollower from "./NotAFollower";
import { PageContext } from "../types/Page";

interface UserProfileInterface {
    user_id: string
    username: string
    userpic: string
    bio: string
    pronouns: string[]
    post_count: number
    followers_count: number
    following_count: number
    is_following: boolean
    is_self: boolean
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
        is_following: false,
        is_self: false,
    })
    const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
    const { setCreatePost } = useOutletContext<PageContext>();
    const debounceFollow = useCallback(
        debounce(async (shouldFollow: boolean, userID: string) => {
            try {
                const url = `http://localhost:3000/user/${userID}/${shouldFollow ? "follow" : "unfollow"}`;
                await axios.post(url, {}, { withCredentials: true });
            } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                toast.error("Unauthorized. Please login again.", { position: "top-right" });
                navigate("/");
                } else {
                console.error(err);
                toast.error("Failed to update follow status. Please try again.");
                }
            } else {
                console.error(err);
                toast.error("Unknown error occurred.");
            }
            }
        }, 500),
        [navigate]
    );

    function handleClick() {
        setProfile((prev) => {
            const newFollowState = !prev.is_following;
            debounceFollow(newFollowState, prev.user_id);
            return { ...prev, is_following: newFollowState };
        });
    }
    
    const { userID } = useParams()
    const user = useUser()

    async function getProfile() {
        try {
            const response = await axios.get(`http://localhost:3000/user/profile/${userID}`, {
                withCredentials: true
            });
            setProfile(response.data.profile);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                toast.error("You are not logged in.");
                navigate("/");
            } else {
                toast.error("An error occurred while fetching the profile.");
                console.error(error);
            }
        }
    }

    useEffect(() => {
        getProfile()
    }, [userID])

    return (
        <div className="relative min-h-screen w-full flex flex-col">
            <div className="bg-white shadow-md rounded-xl flex flex-col flex-grow">
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
                            {profile.is_self ? <EditProfileButton onClick={() => setIsEditProfile(true)}/> :  profile.is_following ? <ProfileUnFollowButton onClick={handleClick}/> : <ProfileFollowButton onClick={handleClick}/>}
                        </div>
                        <div className="mt-2">
                            <UserProfileSlider />
                        </div>
                    </div>
                    {user.id === userID || profile.is_following ? <Outlet context={{ isSelf: profile.is_self, isFollowing: profile.is_following, setCreatePost: setCreatePost }} /> : 
                        <div className="flex-grow w-full flex justify-center items-center bg-indigo-200 rounded-xl shadow-sm p-2">
                            <NotAFollower text={"Only followers can view this user's content. Follow them to gain access."}/>
                        </div>  
                    }
                </div>
            </div>
            {isEditProfile && <EditProfilePage user={{
                ...profile,
                pronouns: profile.pronouns != null && profile.pronouns.length > 0  ? profile.pronouns.join("/") : "",
                userpic: profile.userpic
            }} setIsEditProfile={setIsEditProfile}/>}
        </div>
    )
}


export default UserProfile;