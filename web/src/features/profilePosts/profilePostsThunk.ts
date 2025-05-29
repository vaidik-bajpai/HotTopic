import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Post } from "../../types/post";

interface LoadProfilePostsArgs {
    id: string;
    cursor: string | null;
}

interface LoadProfilePostsResponse {
    posts: Post[];
}

export const loadProfilePosts = createAsyncThunk<
    LoadProfilePostsResponse,
    LoadProfilePostsArgs,
    { rejectValue: { code: number } }
>("profilePosts/load", async ({ id, cursor }, { rejectWithValue }) => {
    try {
        const baseURL = import.meta.env.VITE_BACKEND_BASE_URI
        const res = await axios.get(`${baseURL}/post/${id}`, {
            params: { 
                page_size: 10,
                last_id: cursor
            },
            withCredentials: true,
        });

        const newPosts = res.data.posts

        return {
            posts: newPosts
        };
    } catch (err: any) {
        const code: number = err.response.status as number ?? 500;
        return rejectWithValue({ code });
    }
});
