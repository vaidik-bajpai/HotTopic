import { useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";

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
        <div className="flex-grow w-full bg-indigo-50 py-4 px-2 overflow-y-auto">
            {followingList.length === 0 ? ( 
                <div>You don't follow anyone</div>
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
