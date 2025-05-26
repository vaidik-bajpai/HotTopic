const UserPostGallerySkeleton = () => {
    return (
        <div className="flex-grow w-full bg-indigo-200 py-4 px-2 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-1 w-fit mx-auto my-4">
                    {Array(6).map (() => (
                        <div
                            className="relative cursor-pointer max-w-xs animate-pulse"
                        >
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserPostGallerySkeleton