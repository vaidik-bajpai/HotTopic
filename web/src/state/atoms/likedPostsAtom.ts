import { atom } from "recoil";
import { Post } from "../../types/post";

export const likedPostsState = atom<Post[]>({
    key: "likedPostsState",
    default: [],
});