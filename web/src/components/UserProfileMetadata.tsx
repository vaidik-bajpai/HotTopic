interface UserProfileMetadataInterface {
    metadata: string
    count: number
}

function UserProfileMetadata({metadata, count}: UserProfileMetadataInterface) {
    return (
        <div className="flex flex-col font-mono">
            <p className="font-bold text-sm sm:text-md md:text-lg text-blue-400 2xl:text-2xl">{count}</p>
            <h2 className="font-medium text-xs sm:text-sm md:text-md tracking-wide 2xl:text-xl">{metadata}</h2>
        </div>
    )
}

export default UserProfileMetadata;