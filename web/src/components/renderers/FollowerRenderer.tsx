import { useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";
import FollowerList from "../../types/FollowerList";
import { User } from "lucide-react";

function FollowerRenderer() {
    const { userID } = useParams();
    const [followerList, setFollowerList] = useState<FollowerList[]>([]);
    const [lastID, setLastID] = useState<string>("");

    async function fetchFollower() {
        try {
            const res = await axios.get(
                `http://localhost:3000/user/${userID}/followers?page_size=10&last_id=${lastID}`,
                { withCredentials: true }
            );

            const data = res.data   
            
            if (Array.isArray(data) && data.length > 0) {
                setLastID(data[data.length - 1].user_id);
                setFollowerList((prev) => [...prev, ...data]);
            }
        } catch (err) {
            console.log("error:", err);
        }
    }

    useEffect(() => {
        fetchFollower();
    }, []);

    return (
        <div className="flex-grow flex flex-col w-full bg-indigo-50 py-4 px-2 overflow-y-auto">
            {
                followerList.length == 0 ? (
                    <div className="flex-grow w-full flex justify-center items-center">
                        <NoFollowers />
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-3">
                        {followerList.map((follower) => (
                            <FollowerStrip
                                userID={follower.user_id}
                                userPic={follower.userpic}
                                isFollowing={follower.is_following}
                                key={follower.user_id}
                                username={follower.username}
                            />
                        ))}
                    </div>
                )}
        </div>
    );
}

export default FollowerRenderer;


function NoFollowers() {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <User className="w-16 h-16 mb-4 text-indigo-400"/>

            <h3 className="text-lg font-semibold text-indigo-700 mb-2">No followers yet</h3>
            <p className="text-indigo-600 text-sm">
                Looks like you don’t have any followers right now. Share your profile to gain followers!
            </p>
        </div>
    );
}
