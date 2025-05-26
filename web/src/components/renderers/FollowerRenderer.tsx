import { useNavigate, useOutlet, useOutletContext, useParams } from "react-router";
import FollowerStrip from "../FollowerStrip";
import { useEffect, useState } from "react";
import axios from "axios";
import FollowerList from "../../types/FollowerList";    
import { User } from "lucide-react";
import { toast } from "react-toastify";
import NotAFollower from "../NotAFollower";
import NoContent from "../NoContent";
import { ProfileContextType } from "../../types/Profile";

function FollowerRenderer() {
    const navigate = useNavigate();
    const { userID } = useParams();
    const [followerList, setFollowerList] = useState<FollowerList[]>([]);
    const [lastID, setLastID] = useState<string>("");
    const [isForbidden, setIsForbidden] = useState(false);

    const { isSelf, isFollowing } = useOutletContext<ProfileContextType>() 

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
                } else if (err.response?.status === 403) {
                    setIsForbidden(true);  // Update state on 403
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
            {
                followerList.length == 0 ? (
                    <div className="flex-grow w-full flex justify-center items-center">
                        {isSelf ? <NoContent 
                            image={<User className="w-16 h-16 mb-4 text-indigo-400"/>}
                            title={"No followers yet"}
                            text="Looks like you don't have any followers right now. Share your profile to gain followers!"
                        /> : <NoContent 
                            image={<User className="w-16 h-16 mb-4 text-indigo-400"/>}
                            title={"No followers yet"}
                            text="Looks like the user does not have any followers right now"
                        />}
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
