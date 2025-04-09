import * as motion from "motion/react-client"

function EditProfileButton({onClick}: {onClick: () => void}) {
    return (
        <motion.button
            onClick={onClick}
            className="w-fit font-mono gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-full cursor-pointer mt-3 md:px-4 md:py-3 lg:px-5 md:py-4 transition-colors duration-300">
            <p className="text-xs md:text-md font-bold">Edit profile</p>
        </motion.button>

    )
}

export default EditProfileButton;