import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PostCard } from "./PostCard";
import { useLazyGetProfilePostsQuery } from "../app/api/api"; // adjust path & hook name
import { Post } from "../types/post";

function UserPostsViewer() {
    const { userID } = useParams();
    const navigate = useNavigate();

    if (!userID) {
        navigate(-1);
        return null;
    }

    // Local states for posts, cursor, loading status, hasMore
    const [posts, setPosts] = useState<Post[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [status, setStatus] = useState<"idle" | "pending" | "succeeded" | "failed">("idle");
    const [hasScrolled, setHasScrolled] = useState(false);

    // RTK Query lazy trigger
    const [trigger, { data, isFetching, isError }] = useLazyGetProfilePostsQuery();

    const location = useLocation();
    const startIndex = location.state?.startIndex ?? 0;

    const loaderRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const postRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll to the startIndex post after posts load
    useEffect(() => {
        if (hasScrolled || posts.length === 0) return;
        const el = postRefs.current[startIndex];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setHasScrolled(true);
        }
    }, [startIndex, posts.length]);

    // On mount, fetch the first page
    useEffect(() => {
        setStatus("pending");
        trigger({ userId: userID, cursor: "" }).unwrap().then((res) => {
        setPosts(res.posts);
        setCursor(res.cursor);
        setHasMore(res.cursor !== null);
        setStatus("succeeded");
        }).catch(() => {
        setStatus("failed");
        });
    }, [trigger, userID]);

    // Merge new posts when data changes
    useEffect(() => {
        if (!data) return;

        // Only merge if loading more pages (cursor is not empty string)
        if (cursor && cursor !== "") {
        setPosts((prev) => {
            const map = new Map(prev.map((p) => [p.id, p]));
            data.posts.forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
        });
        } else {
        // If first page or reset, replace posts
        setPosts(data.posts);
        }

        setCursor(data.cursor);
        setHasMore(data.cursor !== null);
    }, [data]);

    const loadMore = useCallback(() => {
        if (isFetching || !cursor || !hasMore) return;
        setStatus("pending");
        trigger({ userId: userID, cursor })
        .unwrap()
        .then(() => setStatus("succeeded"))
        .catch(() => setStatus("failed"));
    }, [cursor, hasMore, isFetching, trigger, userID]);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && status === "succeeded" && hasMore) {
            loadMore();
        }
        });

        if (loaderRef.current) observerRef.current.observe(loaderRef.current);

        return () => observerRef.current?.disconnect();
    }, [loadMore, status, hasMore]);

    return (
        <div className="flex flex-col mx-auto gap-5 max-w-xl my-4">
        {posts.map((post, index) => (
            <div key={post.id} ref={(el) => (postRefs.current[index] = el)}>
            <PostCard
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
            </div>
        ))}
        {status === "pending" && <p className="text-center text-gray-500">Loading...</p>}
        <div ref={loaderRef} className="h-10 col-span-3"></div>
        </div>
    );
}

export default UserPostsViewer;
