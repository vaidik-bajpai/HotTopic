import { useNavigate } from "react-router";
import FollowButton from "./buttons/FollowButton";
import UnFollowButton from "./buttons/UnFollowButton";

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
    isFollowing
}: FollowerStripInterface) {
    const navigate = useNavigate();

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
                <span className="text-gray-800 font-medium text-base sm:text-sm">{username}</span>
            </div>
            <div className="ml-2">
                <button
                    className={`px-4 py-2 sm:px-3 sm:py-2 rounded-md text-sm font-semibold 
                    transition-colors duration-200 w-20 ${
                        isFollowing
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        // Logic can be moved here or retained in child buttons
                    }}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
            </div>
        </div>
    );
}
