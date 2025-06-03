import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { PostCard } from "./PostCard";
import { useUserPosts } from "../context/UserPostContext";
import Spinner from "./Spinner";

function UserPostsViewer() {
    const { userPosts, fetchMorePosts, loading } = useUserPosts();
    const location = useLocation();
    const startIndex = location.state?.startIndex ?? 0;

    const postRefs = useRef<(HTMLDivElement | null)[]>([]);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Scroll to specific post on mount
    useEffect(() => {
        const el = postRefs.current[startIndex];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [startIndex]);

    // Infinite scrolling logic
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(async ([entry]) => {
            if (entry.isIntersecting && hasMore && !loading) {
                await fetchMorePosts();
                // If less than 10 posts were returned, no more to load
                if (userPosts.length % 10 !== 0) {
                    setHasMore(false);
                }
            }
        });

        if (loaderRef.current) {
            observerRef.current.observe(loaderRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [fetchMorePosts, userPosts.length, hasMore, loading]);

    return (
        <div className="flex flex-col mx-auto gap-5 max-w-xl my-4">
            {userPosts.map((post, index) => (
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
            <div ref={loaderRef} className="h-10" />
            {loading && (
                <Spinner />
            )}
        </div>
    );
}

export default UserPostsViewer;
