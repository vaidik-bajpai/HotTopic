interface UserBioInterface {
    bio: string
}

function UserBio({bio}: UserBioInterface) {
    return (
        <div className="font-mono text-xs max-w-4xl flex-wrap mt-3 leading-relaxed break-words 
            sm:text-xs md:text-md lg:text-lg"
        >
            {bio}
        </div>
    )
}

export default UserBio;