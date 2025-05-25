import { useNavigate, useOutlet, useOutletContext, useParams } from "react-router";
import { useUserPosts } from "../context/UserPostContext"; // adjust path
import { Copy, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NotAFollower from "./NotAFollower";
import { PageContext } from "../types/Page";

export default function UserPostsGallery() {
    const { userID } = useParams()
    const { userPosts, fetchMorePosts, forbidden } = useUserPosts();
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const navigate = useNavigate();

    const { setCreatePost } = useOutletContext<PageContext>()

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

    if (forbidden) {
        return (
            <div className="flex-grow w-full flex justify-center items-center bg-indigo-200 rounded-xl shadow-sm p-2">
                <NotAFollower text={"Only followers can view this user's content. Follow them to gain access."}/>
            </div>
        );
    }

    if (userPosts.length === 0) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center bg-indigo-200 rounded-xl shadow-sm p-2">
                <NoPosts setCreatePost={setCreatePost}/>
            </div>
        );
    }

    return (
        <div className="flex-grow w-full bg-indigo-200 py-4 px-2 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-1 w-fit mx-auto my-4">
                    {userPosts.map((post, index) => (
                        <div
                            key={post.id || `${post.media[0]}-${index}`}
                            className="relative cursor-pointer max-w-xs"
                            onClick={() => navigate(`/${userID}/posts`)}
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
            </div>
        </div>
    );
}

function NoPosts({setCreatePost}: {setCreatePost: (val: boolean) => void}) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <Plus className="w-16 h-16 mb-4 text-indigo-400"/>

            <h3 className="text-lg font-semibold text-indigo-700 mb-2">No posts yet</h3>
            <p className="text-indigo-600 text-sm mb-4">
                Start sharing your thoughts and moments with others!
            </p>
            <button
                onClick={() => setCreatePost(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
                Create Post
            </button>
        </div>
    );
}