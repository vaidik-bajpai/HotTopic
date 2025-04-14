import { useEffect, useState } from "react";

interface UserPostsPreviewInterface {
    userID: string;
}

export default function UserPostsPreview({ userID }: UserPostsPreviewInterface) {
    const [postList, setPostList] = useState([]);

    return (
        <div className="flex-grow w-full bg-indigo-50 py-4 px-2 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                {postList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center bg-white py-10 px-6 rounded-xl shadow-sm">
                        <div className="text-md md:text-lg xl:text-xl 2xl:text-2xl font-semibold text-gray-800">
                            No posts yet. Start sharing your thoughts!
                        </div>
                        <div className="mt-2 text-blue-600 font-medium cursor-pointer text-sm md:text-md xl:text-lg 2xl:text-xl hover:underline">
                            Create Post
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Map posts here later */}
                    </div>
                )}
            </div>
        </div>
    );
}
