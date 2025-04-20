import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import debounce from "lodash.debounce"

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
            console.error(err);
            setIsFollowing(prev => !prev); 
        }
        }, 500),
        [userID]
      );

    function handleFollow() {
        setIsFollowing(prev => {
            const newFollowState = !prev
            debounceFollow(newFollowState)
            return newFollowState
        });
    }
    
    return (
        <div className="flex justify-between items-center bg-white px-4 py-2 sm:px-3 sm:py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div
                className="flex items-center gap-3 sm:gap-2 cursor-pointer"
                onClick={() => navigate(`/user-profile/${userID}`)}
            >
                <img
                    src={userPic}
                    alt={username}
                    className="h-10 w-10 sm:h-8 sm:w-8 rounded-full object-cover border border-indigo-200"
                />
                <span onClick={() => navigate(`/user-profile/${userID}`)} 
                    className="text-gray-800 font-medium text-base sm:text-sm">{username}</span>
            </div>
            <div className="ml-2">
                {isFollowing ? <UnFollowButton onClick={handleFollow}/> : <FollowButton onClick={handleFollow}/>}
            </div>
        </div>
    );
}

interface ButtonInterface {
    onClick: () => void
}

export function FollowButton({ onClick }: ButtonInterface) {
    return (
        <button
            className="
                px-4 py-2 text-sm font-semibold rounded-md
                bg-indigo-100 text-indigo-600 hover:bg-indigo-200
                transition-colors duration-200 w-20
                sm:px-3 sm:py-2 sm:text-xs sm:w-fit min-w-[4.5rem]
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
                px-4 py-2 text-sm font-semibold rounded-md
                bg-red-100 text-red-600 hover:bg-red-200
                transition-colors duration-200 w-20
                sm:px-3 sm:py-2 sm:text-xs sm:w-fit min-w-[4.5rem]
            "
            onClick={onClick}
        >
            Unfollow
        </button>
    );
}
