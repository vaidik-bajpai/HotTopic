export interface Post {
    id: string;
    username: string;
    userpic: string;
    caption: string;
    media: string[];
    like_count: number;
    comment_count: number;
    is_liked: boolean;
    is_saved: boolean;
}
  