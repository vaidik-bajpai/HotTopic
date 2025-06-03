import { Post } from "./post";

export interface SavePost extends Post {
    saved_id: string
}