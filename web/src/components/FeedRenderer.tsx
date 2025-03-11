import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import axios from "axios";

interface Post {
    username: string
    userPic: string
    caption: string
    media: string[]
    likeCount: number
    commentCount: number
    isLiked: boolean
    isSaved: boolean
}

export default function FeedRenderer() {  
    const [feed, setFeed] = useState<Post[]>([])

    async function fetchFeed() {
        try {
            const res = await axios.get("http://localhost:3000/user/feed")
            setFeed(res.data)
        } catch(err) {
            console.log("error could not fetch the feed")
        }
    }

    useEffect(() => {
        fetchFeed()
    }, [])
    
    return (
        <div className="flex flex-col mx-auto gap-5 max-w-xl">
            <PostCard userImage={""}
            postImages={["some url"]}
            username={ "vaidik_bajpai"}
            caption={ "Inside city palace, Udaipur"} />
            <PostCard userImage={""}
            postImages={["some url"]}
            username={ "vaidik_bajpai"}
            caption={ "Inside city palace, Udaipur"} />
            <PostCard userImage={""}
            postImages={["some url"]}
            username={ "vaidik_bajpai"}
            caption={ "Inside city palace, Udaipur"} />
            <PostCard userImage={""}
            postImages={["some url"]}
            username={ "vaidik_bajpai"}
            caption={ "Inside city palace, Udaipur"} />
            <PostCard userImage={""}
            postImages={["some url"]}
            username={ "vaidik_bajpai"}
            caption={ "Inside city palace, Udaipur"} />
        </div>
    )
}