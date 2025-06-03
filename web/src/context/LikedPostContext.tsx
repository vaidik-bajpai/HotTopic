import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { showToast } from "../utility/toast";
import { useNavigate, useOutletContext } from "react-router";
import { LikePost } from "../types/LikedPosts";

interface LikedPostContextType {
  likedPosts: LikePost[];
  lastID: string;
  fetchMorePosts: () => Promise<void>;
  setLikedPosts: React.Dispatch<React.SetStateAction<LikePost[]>>;
}

const LikedPostContext = createContext<LikedPostContextType | null>(null);

export const useLikedPosts = () => {
  const context = useContext(LikedPostContext);
  if (!context) throw new Error("useLikedPosts must be used inside LikedPostProvider");
  return context;
};

export const LikedPostProvider = ({ children }: { children: React.ReactNode }) => {
  const [likedPosts, setLikedPosts] = useState<LikePost[]>([]);
  const [lastID, setLastID] = useState("");
  const navigate = useNavigate();

  const { setHeaderText }: { setHeaderText: Dispatch<SetStateAction<string>> } = useOutletContext();

  const fetchMorePosts = async () => {
    const backendBaseURI = import.meta.env.VITE_BACKEND_BASE_URI
    try {
      const res = await axios.get(`${backendBaseURI}/post/liked?page_size=10&last_id=${lastID}`, {
        withCredentials: true,
      });
      const newPosts: LikePost[] = res.data.posts ?? [];
      if (newPosts.length) {
        setLikedPosts((prev) => [...prev, ...newPosts]);
        setLastID(newPosts[newPosts.length - 1].liked_id);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        showToast("Unauthorized. Please login again.", "error")
        navigate("/");
      } else {
        console.error("Failed to fetch liked posts", err);
      }
    }
  };

  useEffect(() => {
    if (likedPosts.length === 0) {
      fetchMorePosts();
    }
    setHeaderText("Liked Posts")
  }, []);

  return (
    <LikedPostContext.Provider value={{ likedPosts, lastID, fetchMorePosts, setLikedPosts }}>
      {children}
    </LikedPostContext.Provider>
  );
};
