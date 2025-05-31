import { useNavigate, useOutlet, useOutletContext } from "react-router-dom";
import { useSavedPosts } from "../context/SavedPostContext";
import { getOptimizedCloudinaryUrl } from "../utility/cloudinary";

function SavedPostsGallery() {
  const { savedPosts } = useSavedPosts();
  const navigate = useNavigate();

  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 text-black h-full">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">No Saved Posts Yet</h2>
        <p className="text-md text-gray-700 mb-6">
          Looks like you haven't saved anything. Discover amazing posts and save your favorites!
        </p>
        <button
          onClick={() => navigate("/feed")}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow transition"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 w-fit mx-auto my-4 mx-2">
      {savedPosts.map((post, index) => (
        <div
          key={post.id}
          className="relative cursor-pointer max-w-xs"
          onClick={() =>
            navigate("/saved-posts", {
              state: { startIndex: index },
            })
          }
        >
          <img
            loading="lazy" 
            src={getOptimizedCloudinaryUrl(post.media[0])}
            alt="post thumbnail"
            className="w-full aspect-square object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default SavedPostsGallery;
