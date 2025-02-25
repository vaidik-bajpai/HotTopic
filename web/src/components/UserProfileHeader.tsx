interface UserProfileHeaderInterface {
    username: string
}

function UserProfileHeader({username}: UserProfileHeaderInterface) {
    return (
        <div className="font-mono p-4 mb-4 sm:text-xl font-bold border-b-1">
            {username}
        </div>
    )
}

export default UserProfileHeader