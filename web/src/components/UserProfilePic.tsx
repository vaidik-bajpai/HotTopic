interface UserProfilePicInterface {
    profilePic: string
}

function UserProfilePic({profilePic}: UserProfilePicInterface) {
    return (
        <img className="ring-2 ring-offset-2 ring-blue-300 rounded-full object-cover w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" 
            src={profilePic} alt="profile pic" />
    )
}

export default UserProfilePic