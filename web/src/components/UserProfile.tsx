import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import EditProfileButton from "./buttons/EditProfileButton";
import UserBio from "./UserBio";
import UserProfileMetadata from "./UserProfileMetadata";
import UserProfileName from "./UserProfileName";
import UserProfilePic from "./UserProfilePic";
import UserProfileSlider from "./UserProfileSlider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import ProfileFollowButton from "./buttons/ProfileFollowButton";
import ProfileUnFollowButton from "./buttons/ProfileUnfollowButton";
import EditProfilePage from "./EditProfilePage";
import NotAFollower from "./NotAFollower";
import { PageContext } from "../types/Page";
import defaultProfilePic from '../assets/Default-Profile.png';
import UserPostGallerySkeleton from "./UserPostGallerySkeleton";
import { showToast } from "../utility/toast";

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
    const [isLoading, setIsLoading] = useState(false);
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
    const { setCreatePost, setHeaderText } = useOutletContext<PageContext & {setHeaderText: Dispatch<SetStateAction<string>>}>();
    async function handleClick() {
        if (isLoading) return; 
        const newFollowState = !profile.is_following;
 
        setProfile(prev => ({
        ...prev,
        is_following: newFollowState,
        followers_count: newFollowState
            ? prev.followers_count + 1
            : prev.followers_count - 1,
        }));

        setIsLoading(true);

        try {
        const url = `http://localhost:3000/user/${profile.user_id}/${newFollowState ? "follow" : "unfollow"}`;
        await axios.post(url, {}, { withCredentials: true });

        // Refresh profile data from backend to sync state
        await getProfile();

        showToast(
            newFollowState
            ? `You are now following ${profile.username}`
            : `You have unfollowed ${profile.username}`
        );
        } catch (err) {
        // Rollback optimistic UI on error
        setProfile(prev => ({
            ...prev,
            is_following: !newFollowState,
            followers_count: newFollowState
            ? prev.followers_count - 1
            : prev.followers_count + 1,
        }));

        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                showToast("Unauthorized. Please login again.", "error");
                navigate("/");
            } else {
                showToast("Failed to update follow status. Please try again.", "error");
            }
        } else {
            showToast("Unknown error occurred.", "error");
        }
        } finally {
            setIsLoading(false);
        }
    }
    
    const { userID } = useParams()
    const user = useUser()

    async function getProfile() {
        try {
            const response = await axios.get(`http://localhost:3000/user/profile/${userID}`, {
                withCredentials: true
            });
            setProfile(response.data.profile);
            setHeaderText(response.data.profile.username)
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                showToast("You are not logged in.", "error");
                navigate("/");
            } else {
                showToast("An error occurred while fetching the profile.", "error");
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
                                <UserProfilePic profilePic={profile.userpic || defaultProfilePic}/>
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
                    { profile.is_self || profile.is_following 
                        ? !isLoading ? <Outlet
                            key={`${profile.user_id}-${profile.is_following}`} 
                            context={{ isSelf: profile.is_self, isFollowing: profile.is_following, setCreatePost: setCreatePost }} /> 
                          : <UserPostGallerySkeleton /  >

                        : <div className="flex-grow w-full flex justify-center items-center bg-indigo-200 rounded-xl shadow-sm p-2">
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