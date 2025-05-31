import {configureStore} from '@reduxjs/toolkit';
import profileReducer from "../features/profile/profileSlice";
import profilePostsReducer from '../features/profilePosts/profilePostsSlice';
import authReducer from "../features/auth/authSlice";
import { api } from './api/api';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        profile: profileReducer,
        profilePosts: profilePostsReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch