import { useNavigate, useParams } from "react-router";
import { useUserPosts, UserPostProvider } from "../context/UserPostContext"; // adjust path
import { Copy, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function UserPostsContent() {
    const { userPosts, fetchMorePosts } = useUserPosts();
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                fetchMorePosts().then(() => {
                    if (userPosts.length % 10 !== 0) setHasMore(false);
                });
            }
        });

        if (loaderRef.current) {
            observerRef.current.observe(loaderRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [fetchMorePosts, userPosts.length, hasMore]);

    if (userPosts.length === 0) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center bg-indigo-50 rounded-xl shadow-sm">
                <NoPosts />
            </div>
        );
    }

    return (
        <div className="flex-grow w-full bg-indigo-50 py-4 px-2 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-1 w-fit mx-auto my-4">
                    {userPosts.map((post, index) => (
                        <div
                            key={post.id || `${post.media[0]}-${index}`}
                            className="relative cursor-pointer max-w-xs"
                            onClick={() => navigate(`/post/${post.id}`)}
                        >
                            <img
                                src={post.media[0]}
                                alt="Post thumbnail"
                                className="w-full aspect-square object-cover rounded"
                            />
                            {post.media.length > 1 && (
                                <div className="absolute z-10 right-0 top-0 opacity-50 p-2 -scale-x-100 overflow-hidden">
                                    <Copy className="text-black" />
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={loaderRef} className="h-10 col-span-3"></div>
                </div>
                {!hasMore && (
                    <p className="text-center text-gray-500 text-sm mt-4">
                        No more posts to load.
                    </p>
                )}
            </div>
        </div>
    );
}


export default function UserPostsPreview() {
    const { userID } = useParams();

    if (!userID) {
        return <div className="text-center text-red-500">User ID not found in URL</div>;
    }

    return (
        <UserPostProvider userID={userID}>
            <UserPostsContent />
        </UserPostProvider>
    );
}

function NoPosts() {
    const navigate = useNavigate();
    
    return (
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <Plus className="w-16 h-16 mb-4 text-indigo-400"/>

            <h3 className="text-lg font-semibold text-indigo-700 mb-2">No posts yet</h3>
            <p className="text-indigo-600 text-sm mb-4">
                Start sharing your thoughts and moments with others!
            </p>
            <button
                onClick={() => navigate("/create-post")}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
                Create Post
            </button>
        </div>
    );
}