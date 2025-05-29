import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../types/post";
import { resetAppState } from "../../app/action";
import { loadProfilePosts } from "./profilePostsThunk";
import { RootState } from "../../app/store";

export interface ProfilePostsState {
    posts: Post[],
    hasMore: boolean,
    cursor: string | null,
    status: 'idle' | 'pending' | 'succeeded' | 'failed',
    errorCode: number
}

const initialState: ProfilePostsState = {
    posts: [],
    status: 'idle',
    hasMore: true,
    cursor: "",
    errorCode: 0
}

export const profilePostsSlice = createSlice({
    name: "profilePosts",
    initialState,
    reducers: {
        resetProfilePosts: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetAppState, () => initialState)
            .addCase(loadProfilePosts.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(loadProfilePosts.fulfilled, (state, action) => {
                const newPosts = action.payload.posts
                const len = newPosts.length ?? 0;
                
                if(len === 0) {
                    state.hasMore = false;
                } else {
                    state.cursor = newPosts[len-1].id
                }
                state.status = "succeeded"
                state.posts.push(...action.payload.posts);
            })
            .addCase(loadProfilePosts.rejected, (state, action) => {
                state.status = "failed";
                state.errorCode = action.payload?.code ?? 500; 
            }); 
    }
})

export const {resetProfilePosts} = profilePostsSlice.actions

export default profilePostsSlice.reducer