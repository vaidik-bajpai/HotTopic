import { createSlice } from "@reduxjs/toolkit";
import { resetAppState } from "../../app/action";
import authThunk from "./authThunk";
import { RootState } from "../../app/store";

interface UserAuthState {
    id: string
    username: string
    email: string
    status: "idle" | "pending" | "succeeded" | "failed",
}

const initialState: UserAuthState = {
    id: "",
    username: "",
    email: "",
    status: "idle",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addAuthState: (state, action) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
        },
        clearAuthState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetAppState, () => initialState)
            .addCase(authThunk.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(authThunk.fulfilled, (state) => {
                state.status = 'succeeded'
            })
            .addCase(authThunk.rejected, (state) => {
                state.status = 'failed'
            })
    }
})

export const {addAuthState, clearAuthState} = authSlice.actions

export default authSlice.reducer
