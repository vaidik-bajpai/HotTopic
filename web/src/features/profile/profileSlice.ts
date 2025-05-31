import { createSlice } from "@reduxjs/toolkit";
import { resetAppState } from "../../app/action";

interface UserProfileState {
    user_id: string
    username: string
    userpic: string
    bio: string
    pronouns: string[]
    post_count: number
    followers_count: number
    following_count: number
    is_following: boolean
    is_self: boolean
}

const initialState: UserProfileState = {
    user_id: "",
    username: "",
    userpic: "",
    bio: "",
    pronouns: [""],
    post_count: 0,
    followers_count: 0,
    following_count: 0,
    is_following: false,
    is_self: false,
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        addProfileState: (_, action) => action.payload,
        clearAuthState: () => initialState,
        updateFollowState: (state, action) => {
            const newFollowState = action.payload;
            state.is_following = newFollowState;
            state.followers_count += newFollowState ? 1 : -1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetAppState, () => initialState)
    }
})

export const {addProfileState, clearAuthState, updateFollowState} = profileSlice.actions

export default profileSlice.reducer
