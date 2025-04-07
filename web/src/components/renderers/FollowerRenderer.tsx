import { useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";

interface FollowerList {
    user_id: string
    username: string
    userpic: string
    is_following: boolean
}

function FollowerRenderer() {
    const { userID } = useParams();
    const [followerList, setFollowerList] = useState<FollowerList[]>([]);
    const [lastID, setLastID] = useState<string>("")

    async function fetchFollower() {
        try {
            const res = await axios.get(`http://localhost:3000/user/${userID}/followers?page_size=10&last_id=${lastID}`, {
                withCredentials: true,
            })
            console.log(res.data)
            if(res.data.length != 0) {
                setLastID(res.data.length.user_id)
            }
            if (res.data.length > 0) {
                setLastID(res.data[res.data.length - 1].user_id); 
                setFollowerList((prev) => [...prev, ...res.data]);
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
            {followerList.map((follower) => (
                    <FollowerStrip userID={follower.user_id} userPic={follower.userpic} isFollowing={follower.is_following} key={follower.user_id} username={follower.username} />
            ))}
            </div>
        </div>
    )
}

export default FollowerRenderer