import { useState } from "react"
import MediaRenderer from "./renderers/MediaRenderer"
import { Bookmark, Heart, Send } from "lucide-react"

interface PostCardInterface {
    userImage: string
    username: string
    postImages: string[]
    caption: string
    likeCount: number
    commentCount: number
    isLiked: boolean
    isSaved: boolean
}

export function PostCard({
    userImage,
    username,
    postImages,
    caption,
    likeCount,
    commentCount,
    isLiked,
    isSaved
}: PostCardInterface) {
    
    const [isCaption, setIsCaption] = useState<boolean>(false)
    console.log(userImage)
    return (
        <div className="font-mono w-full h-full bg-white px-3 pb-2 rounded-xl">
            <div className="flex py-2 px-2 gap-3 items-center">
                <img src={userImage} className="rounded-full w-8 h-8 flex-shrink-0"></img>
                <p className="font-bold text-sm truncate">{username}</p>
            </div>

            <div className="w-full aspect-square bg-blue-100 flex items-center justify-center object-cover border border-gray-500 mb-4">
                <MediaRenderer media={postImages}/>
            </div>

            <div className="flex justify-between px-2 py-2">
                <div className="flex gap-8">
                    <button>
                        <Heart fill={`${isLiked ? "red" : "none"}`}/>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    </button>
                    <button>
                        <Send />
                    </button>
                </div>
                <button>
                    <Bookmark fill={`${isSaved ? "black" : "none"}`}/>
                </button>
            </div>

            <p className={`text-sm px-2 font-medium ${isCaption ? "w-full break-words" : "truncate w-3xs"}`} onClick={() => setIsCaption(!isCaption)}>{caption}</p>
        </div>
    )
}