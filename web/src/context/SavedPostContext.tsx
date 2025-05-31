import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Post } from "../types/post"
import axios from "axios";
import { showToast } from "../utility/toast";
import { useNavigate, useOutletContext } from "react-router";

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
    const navigate = useNavigate();

    const { setHeaderText }: { setHeaderText: Dispatch<SetStateAction<string>> } = useOutletContext();
  
    const fetchMorePosts = async () => {
      const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI
      try {
        const res = await axios.get(`${backendBaseURI}/post/saved?page_size=10&last_id=${lastID}`, {
          withCredentials: true,
        });
        const newPosts: Post[] = res.data.posts ?? [];
        if (newPosts.length) {
          setSavedPosts((prev) => [...prev, ...newPosts]);
          setLastID(newPosts[newPosts.length - 1].id);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          showToast("Unauthorized. Please login again.", "error")
          navigate("/");
        } else {
          console.error("Failed to fetch saved posts", err);
        }
      }
    };
  
    useEffect(() => {
      if (savedPosts.length === 0) {
        fetchMorePosts();
      }

      setHeaderText("Saved Posts")
    }, []);
  
    return (
      <SavedPostContext.Provider value={{ savedPosts, lastID, fetchMorePosts, setSavedPosts }}>
        {children}
      </SavedPostContext.Provider>
    );
  };
  