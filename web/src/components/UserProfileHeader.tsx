interface UserProfileHeaderInterface {
    username: string
}

function UserProfileHeader({username}: UserProfileHeaderInterface) {
    return (
        <div className="font-mono sticky top-0 p-4 text-md font-bold bg-gray-50 shadow-md border-b border-gray-200 text-gray-900 sm:text-lg md:text-xl lg:text-2xl lg:px-8">
            {username}
        </div>
    )
}

export default UserProfileHeader