import { useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";

interface FollowingList {
    user_id: string
    username: string
    userpic: string
    is_following: boolean
}

function FollowingRenderer() {
    const { userID } = useParams();
    const [followingList, setFollowingList] = useState<FollowingList[]>([]);
    const [lastID, setLastID] = useState<string>("")

    async function fetchFollower() {
        try {
            const res = await axios.get(`http://localhost:3000/user/5f97e28e-7aad-422b-9041-33746e4c8135/followings?page_size=10&last_id=${lastID}`, {
                withCredentials: true,
            })
            console.log(res.data)
            if(res.data.length != 0) {
                setLastID(res.data.length.user_id)
            }
            if (res.data.length > 0) {
                setLastID(res.data[res.data.length - 1].user_id); 
                setFollowingList((prev) => [...prev, ...res.data]);
            }
        } catch(err) {
            console.log("error:", err)
        }
    }
    useEffect(() => {
        fetchFollower()
    }, [])
    return (
        <div className="w-full bg-blue-50">
            <div className="max-w-5xl mx-auto">
            {followingList.map((follower) => (
                    <FollowerStrip userID={follower.user_id} userPic={follower.userpic} isFollowing={follower.is_following} key={follower.user_id} username={follower.username} />
            ))}
            </div>
        </div>
    )
}

export default FollowingRenderer