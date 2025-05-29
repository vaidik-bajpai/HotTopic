import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Post } from '../../types/post';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_BASE_URI }),
    tagTypes: ['ProfilePosts'],
    endpoints: (builder) => ({
        getProfilePosts: builder.query<
            { posts: Post[]; hasMore: boolean; cursor: string | null },
            { userId: string; cursor?: string | null }
        >({
            query: ({ userId, cursor }) => ({
                
                url: `/post/${userId}`,
                params: {
                    page_size: 10,
                    last_id: cursor,
                },
                credentials: 'include',
            }),
            transformResponse: (res: {posts: Post[]}) => {
                const posts = res.posts
                const hasMore = res.posts.length === 10;
                const cursor = res.posts.length > 0 ? res.posts[res.posts.length - 1].id : null;

                return {
                    posts,
                    hasMore,
                    cursor, 
                }
            },
            providesTags: (result, error, { userId }) =>
                result
                ? [{ type: 'ProfilePosts', id: userId }]
                : [{ type: 'ProfilePosts', id: 'LIST' }],
        }),
    }),
});

export const { useLazyGetProfilePostsQuery } = api;
