import { useNavigate, useOutletContext, useParams } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import FollowerList from "../../types/FollowerList";
import { User } from "lucide-react";
import { ProfileContextType } from "../../types/Profile";
import FollowerStrip from "../FollowerStrip";
import NotAFollower from "../NotAFollower";
import NoContent from "../NoContent";
import Spinner from "../Spinner";
import { showToast } from "../../utility/toast";

function FollowerRenderer() {
    const navigate = useNavigate();
    const { userID } = useParams();
    const { isSelf, isFollowing } = useOutletContext<ProfileContextType>();

    const [followerList, setFollowerList] = useState<FollowerList[]>([]);
    const [lastID, setLastID] = useState<string>("");
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isForbidden, setIsForbidden] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const fetchFollowers = useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI;

        try {
            const res = await axios.get(
                `${backendBaseURI}/user/${userID}/followers?page_size=10&last_id=${lastID}`,
                { withCredentials: true }
            );

            const data = res.data;

            if (Array.isArray(data) && data.length > 0) {
                setLastID(data[data.length - 1].user_id);
                setFollowerList((prev) => [...prev, ...data]);
                if (data.length < 10) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    showToast("Session expired. Redirecting to login...", "error");
                    navigate("/");
                } else if (err.response?.status === 403) {
                    setIsForbidden(true);
                } else {
                    console.error("Error fetching followers:", err.response?.data || err.message);
                }
            } else {
                console.error("Unknown error fetching followers:", err);
            }
        }

        setLoading(false);
    }, [userID, lastID, hasMore, loading, navigate]);

    useEffect(() => {
        setFollowerList([]);
        setLastID("");
        setHasMore(true);
        setIsForbidden(false);
        fetchFollowers();
    }, [userID, isFollowing, isSelf]);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading && hasMore) {
                fetchFollowers();
            }
        });

        if (loaderRef.current) {
            observerRef.current.observe(loaderRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [fetchFollowers, hasMore, loading]);

    if (isForbidden) {
        return (
            <div className="flex-grow w-full flex justify-center items-center bg-indigo-200">
                <NotAFollower text="Only followers can view this user's content. Follow them to gain access." />
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col w-full bg-indigo-200 py-4 px-2 overflow-y-auto">
            {followerList.length === 0 && !loading ? (
                !loading && <div className="flex-grow w-full flex justify-center items-center">
                    <NoContent
                        image={<User className="w-16 h-16 mb-4 text-indigo-400" />}
                        title={"No followers yet"}
                        text={
                            isSelf
                                ? "Looks like you don't have any followers right now. Share your profile to gain followers!"
                                : "Looks like you are the only follower."
                        }
                    />
                </div>
            ) : (
                <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-3 w-full px-2 md:px-4">
                    {followerList.map((follower) => (
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

            <div ref={loaderRef} />
            {loading && hasMore && <Spinner />}
        </div>
    );
}

export default FollowerRenderer;
