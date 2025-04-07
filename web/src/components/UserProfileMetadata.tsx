interface UserProfileMetadataInterface {
    metadata: string
    count: number
}

function UserProfileMetadata({metadata, count}: UserProfileMetadataInterface) {
    return (
        <div className="flex flex-col font-mono">
            <p className="font-bold text-sm sm:text-md md:text-lg text-indigo-700 2xl:text-2xl">{count}</p>
            <h2 className="font-medium text-xs sm:text-sm md:text-md text-black 2xl:text-xl">{metadata}</h2>
        </div>
    )
}

export default UserProfileMetadata;