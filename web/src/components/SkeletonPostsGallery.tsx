const SkeletonPostsGallery = () => {
    return (
        <div className="flex-grow w-full bg-indigo-200 py-4 px-2 overflow-y-auto">
            <div className="max-w-3xl mx-auto h-full">
                <div className="grid grid-cols-3 gap-1 w-full mx-auto my-4">
                    {Array(8).fill(0).map((_, index) => (
                        <div
                            key={index}
                            className="relative bg-indigo-50 cursor-pointer max-w-xs aspect-square animate-pulse"
                        >
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SkeletonPostsGallery