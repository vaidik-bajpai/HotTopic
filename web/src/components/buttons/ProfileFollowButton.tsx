import { motion } from 'framer-motion';

function ProfileFollowButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-fit font-mono flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white 
                 px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full cursor-pointer mt-3 
                 transition-colors duration-300 shadow-md text-xs sm:text-sm md:text-base font-bold"
      whileHover={{
        y: -2,
        boxShadow: "0px 6px 16px rgba(79, 70, 229, 0.3)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      Follow
    </motion.button>
  );
}

export default ProfileFollowButton;
