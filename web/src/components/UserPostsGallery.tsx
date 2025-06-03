import { useNavigate, useOutlet, useOutletContext, useParams } from "react-router";
import { useUserPosts } from "../context/UserPostContext"; // adjust path
import { Camera, Copy, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NotAFollower from "./NotAFollower";
import { PageContext } from "../types/Page";
import { ProfileContextType } from "../types/Profile";
import NoContent from "./NoContent";
import SkeletonPostsGallery from "./SkeletonPostsGallery";

export default function UserPostsGallery() {
    const { userID } = useParams()
    const { userPosts, fetchMorePosts, forbidden, loading, hasMore } = useUserPosts();
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const navigate = useNavigate();

    const { setCreatePost, isSelf } = useOutletContext<PageContext & ProfileContextType>()

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) { 
                await fetchMorePosts()
            }
        });

        if (loaderRef.current) {
            observerRef.current.observe(loaderRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, [fetchMorePosts, userPosts.length, hasMore]);

    if(loading && userPosts.length === 0 && hasMore) {
        return (
            <SkeletonPostsGallery />
        )
    }

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
                {isSelf 
                    ? <NoPosts 
                        setCreatePost={setCreatePost}/> 
                    : <NoContent 
                        image={<Camera className="w-16 h-16 mb-4 text-indigo-400"/>}
                        title={"No Posts yet"}
                        text="Looks the user has not posted anything yet!"/>}
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
                                <div className="absolute z-10 rounded right-0 top-0 opacity-50 p-2 -scale-x-100 overflow-hidden">
                                    <Copy className="text-black " />
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={loaderRef} className="h-10 col-span-3"></div>
                </div>
                {loading && userPosts.length !== 0 && hasMore &&  (
                    <div className="flex justify-center items-center mt-2 w-full">
                        <div className="w-8 h-8 border-4 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
}

function NoPosts({setCreatePost}: {setCreatePost: (val: boolean) => void}) {
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