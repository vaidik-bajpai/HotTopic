import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import debounce from "lodash.debounce"
import { toast } from "react-toastify";

interface FollowerStripInterface {
    userID: string;
    username: string;
    userPic: string;
    isFollowing: boolean;
}

export default function FollowerStrip({
    userID,
    username,
    userPic,
    isFollowing: initialFollowState
}: FollowerStripInterface) {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(initialFollowState)

    const debounceFollow = useCallback(
    debounce(async (shouldFollow: boolean) => {
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
                    setIsFollowing(prev => !prev);
                }
            } else {
                console.error(err);
                setIsFollowing(prev => !prev);
            }
        }
    }, 500),
    [userID, navigate]);

    function handleFollow() {
        setIsFollowing(prev => {
            const newFollowState = !prev
            debounceFollow(newFollowState)
            return newFollowState
        });
    }
    
    return (
        <div className="w-full flex justify-between items-center bg-white p-2 sm:px-3 sm:py-3 md:px-4 md:py-2 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer hover:shadow-lg hover:shadow-indigo-800 group">
            <div
                className="flex items-center gap-3 md:gap-6 sm:gap-2 cursor-pointer"
                onClick={() => navigate(`/user-profile/${userID}`)}
            >
                <img
                    src={userPic}
                    alt={username}
                    className="md:h-12 md:w-12 sm:h-10 sm:w-10 h-8 sm:w-8 rounded-full object-cover border border-indigo-200 group-hover:border-indigo-800 group-hover:shadow-indigo-800 transition duration-300"
                />
                <span onClick={() => navigate(`/user-profile/${userID}`)} 
                    className="text-gray-800 font-medium text-base text-sm sm:text-md md:text-lg group-hover:text-indigo-800 transition duration-300">{username}</span>
            </div>
            <div className="ml-2">
                {isFollowing ? <UnFollowButton onClick={handleFollow}/> : <FollowButton onClick={handleFollow}/>}
            </div>
        </div>
    );
}

interface ButtonInterface {
    onClick: (e: React.MouseEvent) => void
}

export function FollowButton({ onClick }: ButtonInterface) {
    return (    
        <button
            className="
                sm:px-4 sm:py-2 sm:text-sm font-semibold rounded-md
                bg-indigo-100 text-indigo-600 hover:bg-indigo-200
                transition-colors duration-200
                sm:px-3 sm:py-2 text-xs p-2 w-fit
            "
            onClick={onClick}
        >
            Follow
        </button>
    );
}

export function UnFollowButton({ onClick }: ButtonInterface) {
    return (
        <button
            className="
                sm:px-4 sm:py-2 sm:text-sm font-semibold rounded-md
                bg-red-100 text-red-600 hover:bg-red-200
                transition-colors duration-200
                sm:px-3 sm:py-2 text-xs p-2 w-fit
            "
            onClick={onClick}
        >
            Unfollow
        </button>
    );
}
