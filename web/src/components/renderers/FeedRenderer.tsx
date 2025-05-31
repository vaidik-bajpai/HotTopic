import { useEffect, useRef, useState, useCallback, Dispatch, SetStateAction } from "react";
import { PostCard } from "../PostCard";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router";
import { toast } from "react-toastify";
import { PageContext } from "../../types/Page";
import { showToast } from "../../utility/toast";

interface Post {
  id: string;
  username: string;
  userpic: string;
  caption: string;
  media: string[];
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_saved: boolean;
}

export default function FeedRenderer() {
    const navigate = useNavigate();
    const [feed, setFeed] = useState<Post[]>([]);
    const [lastID, setLastID] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { setHeaderText } = useOutletContext<{setHeaderText: Dispatch<SetStateAction<string>>}>();

    const { setSearch } = useOutletContext<PageContext>();

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const fetchFeed = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:3000/user/feed?page_size=10&last_id=${lastID}`,
                { withCredentials: true }
            );

            const newPosts = Array.isArray(res.data.posts) ? res.data.posts : [];
            setFeed((prev) => [...prev, ...newPosts]);

            if (newPosts.length > 0) {
                const lastPost = newPosts[newPosts.length - 1];
                setLastID(lastPost.id);
            }

            if (newPosts.length < 10) {
                setHasMore(false);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    showToast("Session expired. Redirecting to login...", "error");
                    navigate('/');
                } else {
                    console.error("Error fetching feed:", err.response?.data || err.message);
                }
            } else {
                console.error("Unknown error fetching feed:", err);
            }
        } finally {
            setLoading(false);
        }
    }, [lastID, loading, hasMore, navigate]);

    useEffect(() => {
        fetchFeed();
        setHeaderText("Feed");
    }, []);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
            fetchFeed();
        }
        });

        if (loaderRef.current) {
        observerRef.current.observe(loaderRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [fetchFeed, loading, hasMore]);

    if(feed.length === 0) {
        return ( 
            <div className="h-full flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-indigo-600 text-gray-600 mb-4 text-center">
                    Nothing here yet — check out people to follow!
                </p>
                
                <button
                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow transition"
                    onClick={() => setSearch(true)}
                >
                    Open Search
                </button>
            </div>
        )
    }

    return (
        <div className="flex-grow flex flex-col mx-auto gap-5 max-w-xl my-4">
        {feed.map((post) => (
            <PostCard
            key={post.id}
            id={post.id}
            userImage={post.userpic}
            username={post.username}
            postImages={post.media}
            caption={post.caption}
            likeCount={post.like_count}
            commentCount={post.comment_count}
            isLiked={post.is_liked}
            isSaved={post.is_saved}
            />
        ))}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        <div ref={loaderRef} className="h-10"></div>
        </div>
    );
}
