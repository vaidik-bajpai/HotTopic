import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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

interface LikedPostContextType {
  likedPosts: Post[];
  lastID: string;
  fetchMorePosts: () => Promise<void>;
  setLikedPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const LikedPostContext = createContext<LikedPostContextType | null>(null);

export const useLikedPosts = () => {
  const context = useContext(LikedPostContext);
  if (!context) throw new Error("useLikedPosts must be used inside LikedPostProvider");
  return context;
};

export const LikedPostProvider = ({ children }: { children: React.ReactNode }) => {
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [lastID, setLastID] = useState("");

  const fetchMorePosts = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/post/liked?page_size=10&last_id=${lastID}`, {
        withCredentials: true,
      });
      const newPosts: Post[] = res.data.posts;
      if (newPosts.length) {
        setLikedPosts((prev) => [...prev, ...newPosts]);
        setLastID(newPosts[newPosts.length - 1].id);
      }
    } catch (err) {
      console.error("Failed to fetch liked posts", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    if (likedPosts.length === 0) {
      fetchMorePosts();
    }
  }, []);

  return (
    <LikedPostContext.Provider value={{ likedPosts, lastID, fetchMorePosts, setLikedPosts }}>
      {children}
    </LikedPostContext.Provider>
  );
};
