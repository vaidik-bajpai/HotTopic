import { motion } from "framer-motion";

interface UserProfileSliderItemInterface {
    itemText: string;
    selected: boolean;
    onClick: () => void;
}

export default function UserProfileSliderItem({
    itemText,
    selected,
    onClick
}: UserProfileSliderItemInterface) {
    return (
        <motion.div
            onClick={onClick}
            className={`relative w-full text-center cursor-pointer px-2 py-2 lg:py-3 font-semibold text-sm lg:text-base transition-colors duration-200 
                ${selected ? "text-indigo-800 bg-indigo-100" : "text-gray-600 hover:bg-indigo-50"}`}
        >
            {itemText}
            {selected && (
                <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500 rounded-t"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            )}
        </motion.div>
    );
}
