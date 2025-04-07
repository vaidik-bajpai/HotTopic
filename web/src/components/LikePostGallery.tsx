import { useNavigate } from "react-router-dom";
import { useLikedPosts } from "../context/LikedPostContext";

function LikedPostGallery() {
  const { likedPosts } = useLikedPosts();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-1 w-fit mx-auto my-4">
      {likedPosts.map((post, index) => (
        <div key={post.id} className="cursor-pointer max-w-xs" onClick={() => navigate("/liked-posts", { state: { startIndex: index } })}>
          <img src={post.media[0]} alt="post thumbnail" className="w-full aspect-square object-cover rounded" />
        </div>
      ))}
    </div>
  );
}

export default LikedPostGallery;
