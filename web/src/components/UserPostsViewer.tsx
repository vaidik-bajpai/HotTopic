import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { PostCard } from "./PostCard";
import { useUserPosts } from "../context/UserPostContext";

function UserPostsViewer() {
    const { userPosts, fetchMorePosts } = useUserPosts();
    const location = useLocation();
    const startIndex = location.state?.startIndex ?? 0;

    const postRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const el = postRefs.current[startIndex];
        if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [startIndex, userPosts.length]);

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
        </div>
    );
}

export default UserPostsViewer;
