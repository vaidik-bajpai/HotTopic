import { useState } from "react"

interface UserPostsPreviewInterface {
    userID: string
}

export default function UserPostsPreview({userID}: UserPostsPreviewInterface) {
    const [postList, setPostList] = useState([]);
    return (
        <div className="flex-grow flex justify-center items-center text-center bg-gray-50 border border-gray-200 rounded-lg"> 
            {postList.length === 0 ? 
            <div className="flex flex-col gap-2 font-mono">
                <div className="text-md md:text-lg xl:text-xl 2xl:text-2xl font-bold">
                    No posts yet. Start sharing your thoughts!
                </div>
                <div className="text-blue-400 font-semibold cursor-pointer text-sm md:text-md xl:text-lg 2xl:text-xl">Create Post</div>
            </div>
            :   
            <div>
                
            </div>}
        </div>
    )
}