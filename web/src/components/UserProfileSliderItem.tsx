import * as motion from "motion/react-client"

interface UserProfileSliderItemInterface {
    itemText: string;
    styles?: string;
    selected: boolean;
    onClick: () => void;
}

export default function UserProfileSliderItem({ itemText, styles, selected, onClick }: UserProfileSliderItemInterface) {
    return (
        <motion.div 
            onClick={onClick}
            className={`relative w-full flex justify-center text-sm items-center py-2 bg-sky-100 font-mono font-bold lg:py-3 lg:text-lg ${styles}`}
        >
            {itemText}
            {selected ? (
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-lg bg-blue-400"
                    layoutId="underline"
                    id="underline"
                />
            ) : null}
        </motion.div>
    );
}
