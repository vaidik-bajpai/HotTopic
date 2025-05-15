import { useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";

interface FollowingList {
    user_id: string;
    username: string;
    userpic: string;
    is_following: boolean;
}

function FollowingRenderer() {
    const { userID } = useParams();
    const [followingList, setFollowingList] = useState<FollowingList[]>([]);
    const [lastID, setLastID] = useState<string>("");

    async function fetchFollowing() {
        try {
            const res = await axios.get(
                `http://localhost:3000/user/${userID}/followings?page_size=10&last_id=${lastID}`,
                { withCredentials: true }
            );

            const data = res.data 
            if ( Array.isArray(data) && data.length > 0) {
                setLastID(res.data[res.data.length - 1].user_id);
                setFollowingList((prev) => [...prev, ...res.data]);
            }
        } catch (err) {
            console.log("error:", err);
        }
    }

    useEffect(() => {
        fetchFollowing();
    }, []);

    return (
        <div className="flex-grow flex flex-col w-full bg-indigo-50 py-4 px-2 overflow-y-auto">
            {followingList.length === 0 ? ( 
                <div className="flex-grow w-full flex justify-center items-center">
                    <NoFollowing />
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-3">
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
    