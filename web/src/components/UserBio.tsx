interface UserBioInterface {
    bio: string
}

function UserBio({bio}: UserBioInterface) {
    return (
        <div className="font-mono self-center text-sm font-semibold font-medium flex-wrap mt-3 leading-relaxed break-words 
            sm:text-md md:text-lg"
        >
            {bio}
        </div>
    )
}

export default UserBio;