import { useEffect, useState } from "react";
import { PostCard } from "../PostCard";
import axios from "axios";

interface Post {
    username: string
    userpic: string
    caption: string
    media: string[]
    like_count: number
    comment_count: number
    is_liked: boolean
    is_saved: boolean
}

export default function FeedRenderer() {  
    const [feed, setFeed] = useState<Post[]>([])
    const [lastID, setLastID] = useState<string>("")
    async function fetchFeed() {
        try {
            const res = await axios.get(`http://localhost:3000/user/feed?page_size=10&last_id=${lastID}`, {
                withCredentials: true,
            })
            console.log(res.data)
            setFeed(res.data.posts)
            if (res.data.posts.length > 0) {
                const lastPost = res.data.posts[res.data.posts.length - 1];
                setLastID(lastPost.id); // Assuming posts have an `id` field
              }              
            console.log(res.data.posts[res.data.posts.length-1].id)
        } catch(err) {
            console.log("error could not fetch the feed")
        }
    }

    useEffect(() => {
        fetchFeed()
    }, [])
    
    return (
        <div className="flex-grow flex flex-col mx-auto gap-5 max-w-xl my-4">
            {feed.map((post) => (
                <PostCard 
                userImage={post.userpic} 
                username={post.username} 
                postImages={post.media} 
                caption={post.caption} 
                likeCount={post.like_count} 
                commentCount={post.comment_count} 
                isLiked={post.is_liked} 
                isSaved={post.is_saved} />
            ))}
        </div>
    )
}