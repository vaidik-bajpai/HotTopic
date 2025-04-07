import axios from "axios";
import { selector } from "recoil";
import { Post } from "../../types/post";
import { likedPostsState } from "../atoms/likedPostsAtom";

// Selector to fetch the liked posts
export const fetchLikedPostsSelector = selector<Post[]>({
  key: "fetchLikedPostsSelector",
  get: async () => {
    const response = await axios.get("http://localhost:3000/post/liked?page_size=10", {
      withCredentials: true,
    });
    return response.data.posts;
  },
});

// Selector to extract just the first image from each post
export const likedPostThumbnailsSelector = selector<string[]>({
  key: "likedPostThumbnailsSelector",
  get: ({ get }) => {
    const posts = get(likedPostsState);
    return posts.map((post) => post.media[0]);
  },
});