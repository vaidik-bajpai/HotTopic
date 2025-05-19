import { useNavigate, useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import NotAFollower from "../NotAFollower";

interface FollowingList {
    user_id: string;
    username: string;
    userpic: string;
    is_following: boolean;
}

function FollowingRenderer() {
    const navigate = useNavigate();
    const { userID } = useParams();
    const [followingList, setFollowingList] = useState<FollowingList[]>([]);
    const [lastID, setLastID] = useState<string>("");
    const [isForbidden, setIsForbidden] = useState(false);

    async function fetchFollowing() {
        try {
            const res = await axios.get(
                `http://localhost:3000/user/${userID}/followings?page_size=10&last_id=${lastID}`,
                { withCredentials: true }
            );

            const data = res.data;
            if (Array.isArray(data) && data.length > 0) {
                setLastID(data[data.length - 1].user_id);
                setFollowingList((prev) => [...prev, ...data]);
            }   
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    toast.error("Unauthorized access. Please login again.", {
                        position: 'top-center',
                        autoClose: 2000
                    });
                    navigate('/');
                } else if(err.response?.status === 403) {
                    setIsForbidden(true);  // Update state on 403
                } else {
                    console.error("Error fetching followings:", err.response?.data || err.message);
                }
            } else {
                console.error("Unknown error fetching followings:", err);
            }
        }
    }

    useEffect(() => {
        fetchFollowing();
    }, []);

    if(isForbidden) {
        return (
            <div className="flex-grow w-full flex justify-center items-center bg-indigo-200">
                <NotAFollower text={"Only followers can view this user's content. Follow them to gain access."}/>
            </div>
        )
    }

    return (
        <div className="flex-grow flex flex-col w-full bg-indigo-200 py-4 px-2 overflow-y-auto">
            {followingList.length === 0 ? ( 
                <div className="flex-grow w-full flex justify-center items-center">
                    <NoFollowing />
                </div>
            ) : (
                <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-3 w-full px-2 md:px-4">
                    {followingList.map((follower) => (
                        <FollowerStrip
                            key={follower.user_id}
                            userID={follower.user_id}
                            userPic={follower.userpic}
                            isFollowing={follower.is_following}
                            username={follower.username}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FollowingRenderer;

function NoFollowing() {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <UserPlus className="w-16 h-16 mb-4 text-indigo-400"/>

            <h3 className="text-lg font-semibold text-indigo-700 mb-2">You're not following anyone</h3>
            <p className="text-indigo-600 text-sm">
                Start connecting with others by exploring profiles and following people you're interested in.
            </p>
        </div>
    );
}
    