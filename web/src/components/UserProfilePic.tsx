interface UserProfilePicInterface {
    profilePic: string
}

function UserProfilePic({profilePic}: UserProfilePicInterface) {
    return (
        <img 
        className="ring-2 ring-offset-2 ring-blue-300 rounded-full object-cover w-16 h-16 
        sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-30 lg:h-30 xl:w-40 xl:h-40 2xl:w-50 2xl:h-50" 
            src={profilePic} alt="profile pic" />
    )
}

export default UserProfilePic