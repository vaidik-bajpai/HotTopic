import { useNavigate } from "react-router-dom";
import { useLikedPosts } from "../context/LikedPostContext";
import { Copy } from "lucide-react";

function LikedPostGallery() {
  const { likedPosts } = useLikedPosts();
  
  const navigate = useNavigate();

  if(likedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 text-black h-full">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">No Saved Posts Yet</h2>
        <p className="text-md text-gray-700 mb-6">
          Looks like you haven't liked anything. Discover amazing posts and like your favorites!
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow transition"
        >
          Go to Home
        </button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-1 w-fit mx-auto my-4">
      {likedPosts.map((post, index) => (
        <div key={post.id} className="relative cursor-pointer max-w-xs" onClick={() => navigate("/liked-posts", { state: { startIndex: index } })}>
          <img src={post.media[0]} alt="post thumbnail" className="w-full aspect-square object-cover rounded" />
          {post.media.length > 1 && <div className="absolute z-10 right-0 top-0 opacity-50 p-2 -scale-x-100 overflow-hidden"><Copy className="text-black"/></div>}
        </div>
      ))}
    </div>
  );
}

export default LikedPostGallery;
