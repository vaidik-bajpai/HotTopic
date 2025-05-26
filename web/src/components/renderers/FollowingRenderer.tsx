import { useNavigate, useOutletContext, useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";
import { User, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import NotAFollower from "../NotAFollower";
import NoContent from "../NoContent";
import { ProfileContextType } from "../../types/Profile";

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

    const { isSelf, isFollowing } = useOutletContext<ProfileContextType>() 

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
    }, [userID, isFollowing, isSelf]);

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
                    {isSelf ? <NoContent 
                        image={<UserPlus className="w-16 h-16 mb-4 text-indigo-400"/>}
                        title={"You're not following anyone yet"}
                        text="Start following people to see their latest posts and updates here."
                    /> : <NoContent 
                        image={<UserPlus className="w-16 h-16 mb-4 text-indigo-400"/>}
                        title={"Not following anyone"}
                        text="This user hasn't followed anyone yet."
                    />}
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