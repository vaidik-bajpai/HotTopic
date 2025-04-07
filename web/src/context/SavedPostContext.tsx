import { createContext, useContext, useEffect, useState } from "react";
import { Post } from "../types/post"
import axios from "axios";

interface SavedPostContextType {
    savedPosts: Post[];
    lastID: string;
    fetchMorePosts: () => Promise<void>;
    setSavedPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const SavedPostContext = createContext<SavedPostContextType | null>(null);

export const useSavedPosts = () => {
    const context = useContext(SavedPostContext);
    if(!context) throw new Error("useSavedPosts must be used inside SavedPostProvider")
        return context;
}

export const SavedPostProvider = ({ children }: { children: React.ReactNode }) => {
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [lastID, setLastID] = useState("");
  
    const fetchMorePosts = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/post/saved?page_size=10&last_id=${lastID}`, {
          withCredentials: true,
        });
        const newPosts: Post[] = res.data.posts;
        if (newPosts.length) {
          setSavedPosts((prev) => [...prev, ...newPosts]);
          setLastID(newPosts[newPosts.length - 1].id);
        }
      } catch (err) {
        console.error("Failed to fetch liked posts", err);
      }
    };
  
    useEffect(() => {
      // Initial fetch
      if (savedPosts.length === 0) {
        fetchMorePosts();
      }
    }, []);
  
    return (
      <SavedPostContext.Provider value={{ savedPosts, lastID, fetchMorePosts, setSavedPosts }}>
        {children}
      </SavedPostContext.Provider>
    );
  };
  