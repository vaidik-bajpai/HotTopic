import { useNavigate, useParams } from "react-router"
import FollowButton from "./buttons/FollowButton"
import UnFollowButton from "./buttons/UnFollowButton"

interface FollowerStripInterface {
    userID: string
    username: string
    userPic: string
    isFollowing: boolean
}

export default function FollowerStrip({userID, username, userPic, isFollowing}: FollowerStripInterface) {
    const navigate = useNavigate()
    return (
        <div className="flex justify-between px-4 py-3 bg-sky-200 rounded my-1">
            <div className="flex gap-3 grow items-center">
                <img 
                    src={userPic} alt="" 
                    className="h-10 w-10 rounded-full bg-white object-cover"/>
                <div className="font-medium text-sm text-gray-800 cursor-pointer" onClick={() => navigate(`/user-profile/${userID}`)}>{username}</div>
            </div>
            {isFollowing ? <UnFollowButton /> : <FollowButton /> }
        </div>
    )
}