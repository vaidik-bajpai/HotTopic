import { useState } from "react"

interface PostCardInterface {
    userImage: string
    username: string
    postImages: string[]
    caption: string
}

export function PostCard({userImage, username, postImages, caption}: PostCardInterface) {
    const [isCaption, setIsCaption] = useState<boolean>(false)
    return (
        <div className="font-mono">
            <div className="flex py-2 px-2 gap-3 items-center max-w-3xs">
                <h2 className="rounded-full w-8 h-8 bg-blue-300 flex-shrink-0">{userImage}</h2>
                <p className="font-bold text-sm truncate">{username}</p>
            </div>

            <div className="w-full h-80 bg-blue-100 flex items-center justify-center">
                
            </div>

            <div className="flex justify-between px-2 py-2">
                <div className="flex gap-8">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    </button>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
                    </button>
                </div>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
            </div>

            <p className={`text-sm px-2 font-medium ${isCaption ? "w-full break-words" : "truncate w-3xs"}`} onClick={() => setIsCaption(!isCaption)}>{caption}</p>
        </div>
    )
}