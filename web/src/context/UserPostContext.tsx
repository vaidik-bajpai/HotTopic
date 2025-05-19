import { createContext, useContext, useEffect, useState } from "react";
import { Post } from "../types/post";
import axios from "axios";

interface UserPostContextType {
    userPosts: Post[];
    lastID: string;
    fetchMorePosts: () => Promise<void>;
    setUserPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    loading: boolean;
    forbidden: boolean;   // add forbidden here
}

const UserPostsContext = createContext<UserPostContextType | null>(null);

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
    const [forbidden, setForbidden] = useState(false); // Track 403 state

    const fetchMorePosts = async () => {
        if (loading || !userID || forbidden) return;  // Don't fetch if forbidden
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/post/${userID}?page_size=10&last_id=${lastID}`, {
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
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 403) {
                    setForbidden(true);
                    // optionally notify user here with toast or other UI
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
        setForbidden(false); // reset forbidden state when userID changes
        fetchMorePosts();
    }, [userID]);

    return (
        <UserPostsContext.Provider value={{ userPosts, lastID, fetchMorePosts, setUserPosts, loading, forbidden }}>
            {children}
        </UserPostsContext.Provider>
    );
};
