import { motion } from "framer-motion";

function ProfileUnFollowButton({onClick}: {onClick: () => void}) {
  return (
    <motion.button
        onClick={onClick}
        className="mx-1 text-xs px-3 py-1.5 bg-white text-red-600 font-semibold md:px-5 md:py-2 md:text-base md:mx-2 rounded-full border border-red-500 shadow-md hover:text-white hover:bg-red-600 w-fit cursor-pointer"
        initial={{ boxShadow: "4px 4px #991b1b" }}
        whileHover={{
            boxShadow: "2px 2px #991b1b",
            scale: 1.05,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        >
            Unfollow
    </motion.button>
  );
}

export default ProfileUnFollowButton;
