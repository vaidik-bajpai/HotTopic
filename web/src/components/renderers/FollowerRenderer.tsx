import { useNavigate, useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";
import FollowerList from "../../types/FollowerList";    
import { User } from "lucide-react";
import { toast } from "react-toastify";

function FollowerRenderer() {
    const navigate = useNavigate();
    const { userID } = useParams();
    const [followerList, setFollowerList] = useState<FollowerList[]>([]);
    const [lastID, setLastID] = useState<string>("");

    async function fetchFollower() {
        try {
            const res = await axios.get(
                `http://localhost:3000/user/${userID}/followers?page_size=10&last_id=${lastID}`,
                { withCredentials: true }
            );

            const data = res.data;

            if (Array.isArray(data) && data.length > 0) {
                setLastID(data[data.length - 1].user_id);
                setFollowerList((prev) => [...prev, ...data]);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    toast.error("Session expired. Redirecting to login...", {
                    position: 'top-center',
                    autoClose: 2000,
                    });

                
                    navigate('/');
                } else {
                    console.error("Error fetching followers:", err.response?.data || err.message);
                }
            } else {
                console.error("Unknown error fetching followers:", err);
            }
        }
    }

    useEffect(() => {
        fetchFollower();
    }, []);

    return (
        <div className="flex-grow flex flex-col w-full bg-indigo-200 py-4 px-2 overflow-y-auto">
            {
                followerList.length == 0 ? (
                    <div className="flex-grow w-full flex justify-center items-center">
                        <NoFollowers />
                    </div>
                ) : (
                    <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-3 w-full px-2 md:px-4">
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
