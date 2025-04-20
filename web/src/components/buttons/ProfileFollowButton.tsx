import { motion } from 'framer-motion';

function ProfileFollowButton({onClick}: {onClick: () => void}) {
    return (
        <motion.button
            onClick={onClick}
            className="mx-1 text-xs py-2 px-5 bg-indigo-800 hover:bg-indigo-700 text-white font-semibold md:text-base md:px-8 md:py-2 md:mx-2 rounded-full shadow-md border border-indigo-500 w-fit cursor-pointer"
            initial={{ scale: 1, boxShadow: "4px 4px rgba(49, 46, 129, 0.4)" }}
            whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0px 10px 24px rgba(49, 46, 129, 0.5)"
            }}
            whileTap={{ scale: 0.96 }}
            exit={{scale: 0}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            Follow
        </motion.button>
    );
}

export default ProfileFollowButton;
