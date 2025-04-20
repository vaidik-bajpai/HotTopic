import { createContext, useContext, useEffect, useState } from "react";
import { Post } from "../types/post";
import axios from "axios";

interface UserPostContextType {
    userPosts: Post[];
    lastID: string;
    fetchMorePosts: () => Promise<void>;
    setUserPosts: React.Dispatch<React.SetStateAction<Post[]>>;
    loading: boolean;
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

    const fetchMorePosts = async () => {
        if (loading || !userID) return;
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
            console.error("Failed to fetch user posts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setUserPosts([]);
        setLastID("");
        fetchMorePosts();
    }, [userID]);

    return (
        <UserPostsContext.Provider value={{ userPosts, lastID, fetchMorePosts, setUserPosts, loading }}>
            {children}
        </UserPostsContext.Provider>
    );
};
