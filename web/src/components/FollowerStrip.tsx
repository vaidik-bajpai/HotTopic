import FollowButton from "./FollowButton"
import UnFollowButton from "./UnFollowButton"

interface FollowerStripInterface {
    userID: string
    username: string
    userPic: string
    isFollowing: boolean
}

export default function FollowerStrip({userID, username, userPic, isFollowing}: FollowerStripInterface) {
    return (
        <div className="flex justify-between px-4 py-3 bg-white border-b-2 border-gray-900">
            <div className="flex gap-3 grow items-center">
                <img 
                    src={userPic} alt="" 
                    className="h-10 w-10 rounded-full bg-white object-cover"/>
                <div className="font-medium text-sm text-gray-800 cursor-pointer">{username}</div>
            </div>
            {isFollowing ? <UnFollowButton /> : <FollowButton /> }
        </div>
    )
}