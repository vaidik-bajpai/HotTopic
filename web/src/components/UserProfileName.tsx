interface UserProfileName {
    name: string
    pronouns: string[]
}

function UserProfileName({name, pronouns}: UserProfileName) {
    return (
        <div className="font-mono gap-2 flex items-center">
            <h2 className="font-bold text-sm sm:text-md md:text-lg">{name}</h2>
            <span className="text-xs sm:text-sm md:text-md">
                {pronouns.map((pronoun, index) => (
                    <span>
                        {pronoun}
                        {index === pronouns.length - 1 ? "" : "/"}
                    </span>
                ))}
            </span>
        </div>
    )
}

export default UserProfileName;