import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addAuthState } from "./authSlice";

const authThunk = createAsyncThunk(
  "auth/fetchAuthUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
        const baseURL = import.meta.env.VITE_BACKEND_BASE_URI;
        const res = await axios.get(`${baseURL}/auth/me`, {
            withCredentials: true,
        });

        console.log(res)

        if (res.status === 200 && res.data?.user) {
            dispatch(addAuthState(res.data.user));
            return res.data.user;
        } else {
            return rejectWithValue("No user data found");
        }
    } catch (err: any) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
            return rejectWithValue("Unauthorized");
            }
            return rejectWithValue(err.response?.data?.error || "Failed to fetch user");
        }
        return rejectWithValue("An unknown error occurred");
    }
  }
);

export default authThunk;
