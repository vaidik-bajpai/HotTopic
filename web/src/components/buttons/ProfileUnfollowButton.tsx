import { motion } from "framer-motion";

function ProfileUnFollowButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-fit font-mono flex items-center gap-2 bg-white text-red-600 hover:bg-red-600 hover:text-white 
                 px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full cursor-pointer mt-3 
                 transition-colors duration-300 shadow-md border border-red-500 text-xs sm:text-sm md:text-base font-bold"
      whileHover={{
        y: -2,
        boxShadow: "0px 6px 16px rgba(185, 28, 28, 0.3)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      Unfollow
    </motion.button>
  );
}

export default ProfileUnFollowButton;
