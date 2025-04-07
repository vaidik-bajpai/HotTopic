import * as motion from "motion/react-client"

function EditProfileButton() {
    return (
        <motion.button
            className="w-fit font-mono gap-2 bg-blue-400 px-4 py-3 rounded-full cursor-pointer mt-3 md:px-4 md:py-3 lg:px-5 md:py-4">
                <p className="text-xs md:text-md font-bold">Edit profile</p>
        </motion.button>
    )
}

export default EditProfileButton;