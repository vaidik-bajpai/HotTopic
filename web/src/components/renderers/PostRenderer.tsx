import { useEffect, useState } from "react";
import { PostCard } from "../PostCard";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { Post } from "../../stories/UserProfileMetadata.stories";
import { toast } from "react-toastify";

interface Post {
    id: string
    username: string
    userPic: string
    caption: string
    media: string[]
    like_count: number
    comment_count: number
    is_liked: boolean
    is_saved: boolean
}

export default function FeedRenderer() { 
    const navigate = useNavigate(); 
    const [postList, setPostList] = useState<Post[]>([])
    const [lastID, setLastID] = useState<string>("")
    const { userID } = useParams()
    
    
    async function fetchPosts() {
        try {
            const res = await axios.get(
                `http://localhost:3000/post/${userID}?page_size=10&last_id=${lastID}`,
                {
                    withCredentials: true,
                }
            );
        
            if (res.data?.posts.length !== 0) {
                setPostList((prev) => [...prev, ...res.data.posts]);
                setLastID(res.data.posts[res.data.posts.length - 1].id);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    toast.error("Unauthorized access. Please login again.", {
                        position: 'top-center',
                        autoClose: 2000
                    });
                    navigate('/');
                } else {
                    console.error("Error fetching posts:", err.response?.data || err.message);
                }
            } else {
                console.error("Unknown error fetching posts:", err);
            }
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [userID])
    
    return (
        <div className="flex flex-col mx-auto gap-5 max-w-xl">
            {postList.map((post) => (
                <PostCard 
                    id={post.id}
                    userImage={post.userPic} 
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