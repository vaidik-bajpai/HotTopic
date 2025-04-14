import { useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";
import FollowerList from "../../types/FollowerList";

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
        <div className="flex-grow w-full bg-indigo-50 py-4 px-2 overflow-y-auto">
            {
                followerList.length == 0 ? (
                    <div className="bg-white h-full flex justify-center items-center">
                        <div>You don't have any followers</div>
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
