import { createContext, useContext, useEffect, useState } from "react";
import { Post } from "../types/post";
import axios from "axios";
import { showToast } from "../utility/toast";
import { useNavigate } from "react-router";

interface UserPostContextType {
    userPosts: Post[];
    lastID: string;
    fetchMorePosts: () => Promise<void>;
    setUserPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    loading: boolean;
    forbidden: boolean;
    hasMore: boolean
}

const UserPostsContext = createContext<UserPostContextType | null>(null);
UserPostsContext.displayName = "UserPostsContext";

export const useUserPosts = () => {
    const context = useContext(UserPostsContext);
    if (!context) throw new Error("useUserPosts must be used inside UserPostProvider");
    return context;
};

export const UserPostProvider = ({
    children,
    userID,
}: {
    children: React.ReactNode;
    userID: string;
}) => {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [lastID, setLastID] = useState("");
    const [loading, setLoading] = useState(false);
    const [forbidden, setForbidden] = useState(false); 
    const [hasMore, setHasMore] = useState<boolean>(true);
    const navigate = useNavigate();
    
    const fetchMorePosts = async () => {
        if (loading || !userID || forbidden || !hasMore) return;
        setLoading(true);
        const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI;

        try {
            const res = await axios.get(`${backendBaseURI}/post/${userID}?page_size=10&last_id=${lastID}`, {
                withCredentials: true,
            });

            const newPosts: Post[] = res.data.posts;

            if (newPosts.length) {
                setUserPosts((prev) => {
                    const ids = new Set(prev.map((p) => p.id));
                    const unique = newPosts.filter((p) => !ids.has(p.id));
                    return [...prev, ...unique];
                });

                setLastID(newPosts[newPosts.length - 1].id);

                if (newPosts.length < 10) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    showToast("Unauthorized. Please login again.", "error");
                    navigate("/");
                } else if (err.response?.status === 403) {
                    setForbidden(true);
                    console.warn("Access forbidden: you do not have permission to view these posts.");
                } else {
                    console.error("Failed to fetch user posts", err);
                }
            } else {
                console.error("Unknown error fetching user posts", err);
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setUserPosts([]);
        setLastID("");
        setForbidden(false);
        setHasMore(true);
        fetchMorePosts();
    }, [userID]);


    return (
        <UserPostsContext.Provider value={{ 
            userPosts, 
            lastID, 
            fetchMorePosts, 
            setUserPosts, 
            loading, 
            forbidden, 
            hasMore 
        }}>
            {children}
        </UserPostsContext.Provider>
    );
};