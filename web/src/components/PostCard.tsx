import { useCallback, useState } from "react"
import MediaRenderer from "./renderers/MediaRenderer"
import { Bookmark, Heart, Send } from "lucide-react"
import axios from "axios"
import debounce from "lodash.debounce"
import { toast } from "react-toastify"
import { showToast } from "../utility/toast"
import { getOptimizedCloudinaryUrl } from "../utility/cloudinary"

interface PostCardInterface {
    id: string
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
    id,
    userImage,
    username,
    postImages,
    caption,
    likeCount: initialLikeCount,
    isLiked: initialLikedState,
    isSaved: initialSavedState
}: PostCardInterface) {
    const [isLiked, setIsLiked] = useState(initialLikedState)
    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [isSaved, setIsSaved] = useState(initialSavedState)
    const [isCaption, setIsCaption] = useState<boolean>(false)

    const debounceLike = useCallback(
        debounce(async (shouldLike: boolean) => {
            const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI
            try {
                const url = `${backendBaseURI}/post/${id}/${shouldLike ? "like" : "unlike"}`
                await axios.post(url, {}, {withCredentials: true})

            } catch(err) {
                showToast("could not process your like", "error")
                setIsLiked(prev => {
                    const rollbackState = !prev;
                    setLikeCount(count => rollbackState ? count + 1 : count - 1);
                    return rollbackState;
                });
            }
        }, 500),
        [id]
    );

    function handleLike() {
        setIsLiked(prev => {
            const newLikedState = !prev
            setLikeCount(count => newLikedState ? count + 1 : count - 1);
            debounceLike(newLikedState)
            return newLikedState
        })
    }

    const debounceSave = useCallback(
        debounce(async (shouldSave: boolean) => {
            const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI
            try {
                const url = `${backendBaseURI}/post/${id}/${shouldSave ? "save" : "unsave"}`
                await axios.post(url, {}, {withCredentials: true})
            } catch(err) {
                console.log(err)
                setIsSaved(prev => !prev)
            }
        }, 500),
        [id]
    );

    function handleSave() {
        setIsSaved(prev => {
            const newSavedState = !prev
            debounceSave(newSavedState)
            return newSavedState
        })
    }
    return (
        <div className="font-mono w-full h-full bg-white px-3 pb-2 rounded-xl">
            <div className="flex py-2 px-2 gap-3 items-center">
                <img src={getOptimizedCloudinaryUrl(userImage)} className="rounded-full w-8 h-8 flex-shrink-0"></img>
                <p className="font-bold text-sm truncate">{username}</p>
            </div>

            <div className="w-full aspect-square bg-blue-100 flex items-center justify-center object-cover border border-gray-500 mb-4">
                <MediaRenderer media={postImages}/>
            </div>

            <div className="flex justify-between px-2 py-2">
                <div className="flex gap-8">
                    <div className="flex gap-2">
                        <button onClick={handleLike}>
                            <Heart className={`${isLiked ? "scale-100" : "scale-0 w-0 h-0"} transition-transform duration-500 text-red-500`} fill="red"/>
                            <Heart className={`${isLiked ? "scale-0 w-0 h-0" : "scale-100"} transition-transform duration-300`} />
                        </button>
                        {likeCount != 0 && <div>{likeCount}</div>}
                    </div>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    </button>
                    <button>
                        <Send />
                    </button>
                </div>
                <button onClick={handleSave}>
                    <Bookmark className={`${isSaved ? "scale-100" : "scale-0 w-0 h-0"} transition-transform duration-500 text-indigo-500`} fill="#6366F1"/>
                    <Bookmark className={`${isSaved ? "scale-0 w-0 h-0" : "scale-100"} transition-transform duration-300`} />
                </button>
            </div>

            <p className={`text-sm px-2 font-medium ${isCaption ? "w-full break-words" : "truncate w-3xs"}`} onClick={() => setIsCaption(!isCaption)}>{caption}</p>
        </div>
    )
}