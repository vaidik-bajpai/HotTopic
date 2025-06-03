import { Post } from "./post";

export interface LikePost extends Post {
    liked_id: string
}